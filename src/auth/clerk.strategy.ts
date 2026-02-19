import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyToken } from '@clerk/backend';

interface ClerkStrategyOptions {
  jwtFromRequest: any;
  secretOrKey: string;
  passReqToCallback: boolean;
}

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const options: ClerkStrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('CLERK_SECRET_KEY') || 'fallback-secret',
      passReqToCallback: true,
    };
    super(options as any);
  }

  async validate(req: any, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      console.log('ClerkStrategy: No token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify Clerk token with clock skew tolerance
      const clerkPayload = await verifyToken(token, {
        secretKey: this.config.get<string>('CLERK_SECRET_KEY')!,
        clockSkewInMs: 300000, // Allow 5 minutes of clock skew
      });

      const clerkId = clerkPayload.sub;
      const email = clerkPayload.email as string;

      console.log(`ClerkStrategy: Validating user ${clerkId} (${email})`);

      if (!clerkId) {
        throw new UnauthorizedException('Invalid token payload: missing sub');
      }

      // Find or create user in our database
      let user = await this.prisma.user.findUnique({
        where: { clerkId } as any,
        include: { Profile: true },
      });

      if (!user) {
        console.log(`ClerkStrategy: User ${clerkId} not found in DB. Creating...`);
        try {
          // Create user without role - they'll select it later
          user = await this.prisma.user.create({
            data: {
              clerkId,
              email: email || `no-email-${clerkId}@example.com`, // Fallback
              // No default role - user must select
            } as any,
            include: { Profile: true },
          });
          console.log(`ClerkStrategy: User created with ID ${user.id}`);
        } catch (createError) {
          console.error('ClerkStrategy: Failed to create user:', createError);
          throw createError;
        }
      } else {
        console.log(`ClerkStrategy: User found in DB (ID: ${user.id})`);
      }

      return user;
    } catch (error) {
      console.error('Clerk token validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
