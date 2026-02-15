import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken, createClerkClient } from '@clerk/backend';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            // Verify Clerk token directly using Clerk SDK
            const clerkPayload = await verifyToken(token, {
                secretKey: this.config.get<string>('CLERK_SECRET_KEY')!,
            });

            const clerkId = clerkPayload.sub;
            const email = clerkPayload.email as string;

            console.log(`ClerkAuthGuard: Validating user ${clerkId} (${email})`);

            if (!clerkId) {
                throw new UnauthorizedException('Invalid token payload: missing sub');
            }

            // Find or create user in our database
            let user = await this.prisma.user.findUnique({
                where: { clerkId } as any,
                include: { Profile: true },
            });

            if (!user) {
                console.log(`ClerkAuthGuard: User ${clerkId} not found in DB. Creating...`);

                let userEmail = email;
                if (!userEmail) {
                    try {
                        const clerkClient = createClerkClient({ secretKey: this.config.get<string>('CLERK_SECRET_KEY') });
                        const clerkUser = await clerkClient.users.getUser(clerkId);
                        userEmail = clerkUser.emailAddresses[0]?.emailAddress;
                        console.log(`ClerkAuthGuard: Fetched email from Clerk: ${userEmail}`);
                    } catch (err) {
                        console.error('ClerkAuthGuard: Failed to fetch user details from Clerk:', err);
                    }
                }

                try {
                    user = await this.prisma.user.create({
                        data: {
                            clerkId,
                            email: userEmail || `no-email-${clerkId}@example.com`,
                            // No default role - user must select
                        } as any,
                        include: { Profile: true },
                    });
                    console.log(`ClerkAuthGuard: User created with ID ${user.id}`);
                } catch (createError) {
                    console.error('ClerkAuthGuard: Failed to create user:', createError);
                    throw createError;
                }
            } else {
                console.log(`ClerkAuthGuard: User found in DB (ID: ${user.id})`);
            }

            // Attach user to request so decorators like @CurrentUser work
            request.user = user;
            return true;

        } catch (error) {
            console.error('ClerkAuthGuard: Validation error:', error);
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
