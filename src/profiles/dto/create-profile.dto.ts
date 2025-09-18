import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsDateString, Length } from "class-validator";

export class CreateProfileDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @ApiProperty({ example: '1990-01-01', description: 'Birthday of the user', required: false })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiProperty({ example: 'A short bio about the user', description: 'Bio of the user', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '123 Main St, City, Country', description: 'Address of the user', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the user', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
  