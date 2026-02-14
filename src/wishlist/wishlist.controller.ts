import { Controller, Post, Get, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/user.decorator';

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(AuthGuard('clerk'))
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  async addToWishlist(@CurrentUser() user: any, @Body('productId') productId: string) {
    return this.wishlistService.addToWishlist(user.id, productId);
  }

  @Get()
  async getWishlist(@CurrentUser() user: any) {
    return this.wishlistService.getWishlist(user.id);
  }

  @Delete(':productId')
  async removeFromWishlist(@CurrentUser() user: any, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(user.id, productId);
  }
}

