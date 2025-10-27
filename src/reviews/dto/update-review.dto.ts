import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ required: false, example: 4, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ required: false, example: 'Updated review' })
  @IsOptional()
  @IsString()
  comment?: string;
}

