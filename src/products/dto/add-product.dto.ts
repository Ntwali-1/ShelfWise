import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ProductDto {
  @ApiProperty({ example: 'smart-watch' } )
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'A smart watch with various features' } )
  description: string;

  @ApiProperty({ example: 199.99 } )
  @IsNotEmpty()
  price: number;
  
  @ApiProperty({ example: 'electronics' } )
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 50 } )
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 'SW-001' } )
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'https://example.com/images/smart-watch.jpg' } )
  imageUrl: string;
}
