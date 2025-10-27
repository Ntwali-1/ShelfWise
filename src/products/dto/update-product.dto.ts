import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ required: false, example: 'smart-watch' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'A smart watch with various features' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: 199.99 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false, example: 'https://example.com/images/smart-watch.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

