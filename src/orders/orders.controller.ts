import { Controller, Post, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/rbac/role.decorator";
import { Role } from "src/rbac/role.enum";
import { RolesGuard } from "src/rbac/role.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiBearerAuth()
@Roles(Role.Client)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor (private readonly ordersService: OrdersService){}

  @Post('place')
  async placeOrder (){
    
  }

}