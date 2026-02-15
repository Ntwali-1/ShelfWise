import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/rbac/role.enum';

export class SelectRoleDto {
  @ApiProperty({ 
    enum: Role, 
    description: 'User role',
    example: 'client'
  })
  @IsEnum(Role)
  role: Role;
}
