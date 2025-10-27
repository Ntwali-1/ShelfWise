import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    example: 'processing',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  })
  @IsNotEmpty()
  @IsIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

