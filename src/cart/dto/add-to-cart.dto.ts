import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 'prod123' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}

