import { Body, Controller, Post, Get, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";  
import { VerifyUserDto } from "./dto/verify-user.dto";
import { SelectRoleDto } from "./dto/select-role.dto";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/decorators/user.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('verify')
  async verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return this.usersService.verifyUser(verifyUserDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginUser(loginUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('clerk'))
  @Put('select-role')
  async selectRole(@CurrentUser() user: any, @Body() selectRoleDto: SelectRoleDto) {
    return this.usersService.selectRole(user.id, selectRoleDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('clerk'))
  @Get('me')
  async getCurrentUser(@CurrentUser() user: any) {
    return this.usersService.getCurrentUser(user.id);
  }
}