import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductsDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false, example: 'electronics' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ required: false, example: 1000 })
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ required: false, example: 'smart watch' })
  @IsOptional()
  @IsString()
  search?: string;
}

