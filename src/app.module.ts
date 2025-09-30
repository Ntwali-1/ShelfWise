import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profiles/profile.module';
import { ProductModule } from './products/products.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [UsersModule, ProfileModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), ProductModule, PrismaClient],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
