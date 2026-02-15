import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    // Check if product exists and has sufficient stock
    const product = await this.prisma.product.findUnique({
      where: { id: addToCartDto.productId }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.quantity < addToCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart for user
    let cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId }
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: addToCartDto.productId
        }
      }
    });

    if (existingItem) {
      // Update quantity
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + addToCartDto.quantity },
        include: { product: true }
      });
    } else {
      // Create new cart item
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: addToCartDto.productId,
          quantity: addToCartDto.quantity
        },
        include: { product: true }
      });
    }
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      }
    });

    if (!cart) {
      return { CartItem: [], total: 0 };
    }

    const total = cart.CartItem.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return { ...cart, total };
  }

  async removeFromCart(userId: number, itemId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId }
    });

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return { message: 'Cart cleared successfully' };
  }
  async updateCartItem(userId: number, itemId: number, quantity: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id
      },
      include: { product: true }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock availability
    if (cartItem.product.quantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: { include: { category: true } } }
    });
  }
}

