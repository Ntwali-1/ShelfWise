import { Controller, Post, Get, Patch, UseGuards, Body, Param, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/rbac/role.decorator";
import { Role } from "src/rbac/role.enum";
import { RolesGuard } from "src/rbac/role.guard";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/decorators/user.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Client endpoints
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Post('create')
  async createOrder(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, createOrderDto);
  }

  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Get('my-orders')
  async getMyOrders(@CurrentUser() user: any) {
    return this.ordersService.getMyOrders(user.id);
  }

  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getOrderById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.getOrderById(user.id, id);
  }

  // Admin endpoints
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('all')
  async getAllOrders(@Query('status') status?: string) {
    return this.ordersService.getAllOrders(status);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateOrderStatus(id, updateStatusDto);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('statistics/overview')
  async getOrderStatistics() {
    return this.ordersService.getOrderStatistics();
  }
}
