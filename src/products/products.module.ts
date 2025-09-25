import { Module } from "@nestjs/common";
import { ProductController } from "./products.controller";
import { ProductService } from "./products.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})

export class ProductModule {}