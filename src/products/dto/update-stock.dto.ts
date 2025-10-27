import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsIn } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 'add', enum: ['add', 'reduce'] })
  @IsNotEmpty()
  @IsIn(['add', 'reduce'])
  operation: 'add' | 'reduce';
}

