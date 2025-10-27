import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiProperty({ required: false, example: 'Software developer' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false, example: '123 Main St, City' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

