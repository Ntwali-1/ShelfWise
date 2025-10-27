import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CartService } from "src/cart/cart.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.CartItem.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Check stock availability
    for (const item of cart.CartItem) {
      if (item.product.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name}`
        );
      }
    }

    // Calculate total
    const totalPrice = cart.CartItem.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        id: Math.random().toString(36).substring(2, 15),
        userId,
        address: createOrderDto.address,
        totalPrice,
        OrderItem: {
          create: cart.CartItem.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        OrderItem: {
          include: { product: true }
        }
      }
    });

    // Update product quantities
    for (const item of cart.CartItem) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } }
      });
    }

    // Clear cart
    await this.cartService.clearCart(userId);

    return order;
  }

  async getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        OrderItem: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(userId: number, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        OrderItem: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Admin methods
  async getAllOrders(status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            Profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        OrderItem: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateOrderStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: updateStatusDto.status },
      include: {
        OrderItem: {
          include: { product: true }
        }
      }
    });
  }

  async getOrderStatistics() {
    const [totalOrders, totalRevenue, statusCounts] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { totalPrice: true }
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      ordersByStatus: statusCounts.map(s => ({
        status: s.status,
        count: s._count
      }))
    };
  }
}
