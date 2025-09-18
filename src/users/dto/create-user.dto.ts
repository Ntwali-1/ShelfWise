import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test@gmail.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsNotEmpty()
  password: string;
}