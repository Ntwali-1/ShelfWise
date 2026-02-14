import { Controller, Post, Get, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/user.decorator';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('clerk'))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  async addToCart(@CurrentUser() user: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(user.id, addToCartDto);
  }

  @Get()
  async getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.id);
  }

  @Delete('items/:itemId')
  async removeFromCart(
    @CurrentUser() user: any,
    @Param('itemId', ParseIntPipe) itemId: number
  ) {
    return this.cartService.removeFromCart(user.id, itemId);
  }

  @Delete()
  async clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.id);
  }
}

