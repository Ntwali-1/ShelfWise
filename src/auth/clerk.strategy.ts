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
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify Clerk token
      const clerkPayload = await verifyToken(token, {
        secretKey: this.config.get<string>('CLERK_SECRET_KEY')!,
      });

      const clerkUserId = clerkPayload.sub;
      const email = clerkPayload.email as string;

      if (!clerkUserId || !email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Find or create user in our database
      let user = await this.prisma.user.findUnique({
        where: { clerkId: clerkUserId } as any,
        include: { Profile: true },
      });

      if (!user) {
        // Create user without role - they'll select it later
        user = await this.prisma.user.create({
          data: {
            clerkId: clerkUserId,
            email: email,
            // No default role - user must select
          } as any,
          include: { Profile: true },
        });
      }

      return user;
    } catch (error) {
      console.error('Clerk token validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
