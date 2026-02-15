import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { ClerkStrategy } from './clerk.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

import { ClerkAuthGuard } from './clerk-auth.guard';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWTSECRETKEY'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [JwtStrategy, ClerkStrategy, PrismaService, ClerkAuthGuard],
  exports: [JwtStrategy, ClerkStrategy, ClerkAuthGuard],
})
export class AuthModule { }
