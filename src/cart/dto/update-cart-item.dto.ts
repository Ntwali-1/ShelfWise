import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
    @ApiProperty({
        description: 'The new quantity of the product',
        example: 2,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    quantity: number;
}
