import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../../rbac/role.enum";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test@gmail.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'client', enum: Role, description: 'User role' })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}