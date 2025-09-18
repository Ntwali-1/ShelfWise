import { Controller, Post, Body, Request, UseGuards, Get, Patch} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@Controller('profile')

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createProfile(@Body() createProfil: CreateProfileDto, @Request() req) {
    const userId = req.user.id;
    return this.profileService.createProfile(createProfil, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    return this.profileService.getProfile(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  async updateProfile(@Body() data: any, @Request() req) {
    const userId = req.user.id;
    return this.profileService.updateProfile(data, userId);
  }
}