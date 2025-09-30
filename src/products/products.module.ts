import { Module } from "@nestjs/common";
import { ProductController } from "./products.controller";
import { ProductService } from "./products.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ProductGateway } from "./product.gateway";

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, ProductGateway],
})

export class ProductModule {}