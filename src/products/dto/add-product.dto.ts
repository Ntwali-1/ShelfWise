import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 'smart-watch' } )
  name: string;

  @ApiProperty({ example: 'A smart watch with various features' } )
  description: string;

  @ApiProperty({ example: 199.99 } )
  price: number;
  
  @ApiProperty({ example: 'electronics' } )
  category: string;

  @ApiProperty({ example: 50 } )
  quantity: number;

  @ApiProperty({ example: 'SW-001' } )
  sku: string;

  @ApiProperty({ example: 'https://example.com/images/smart-watch.jpg' } )
  imageUrl: string;
}
