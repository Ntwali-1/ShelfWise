import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from "src/mailer/mailer.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWTSECRETKEY'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MailerService],
})

export class UsersModule {}