import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profiles/profile.module';
import { ProductModule } from './products/products.module';
import { PrismaClient } from '@prisma/client';
import { OrderModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ProfileModule,
    AuthModule,
    ProductModule,
    CategoriesModule,
    CartModule,
    OrderModule,
    WishlistModule,
    ReviewsModule,
    PrismaClient
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
