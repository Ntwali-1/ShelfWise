import { Controller, Post, Body, UseGuards, Get, Patch, Put } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/decorators/user.decorator";

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  async createProfile(@CurrentUser() user: any, @Body() createProfile: CreateProfileDto) {
    return this.profileService.createProfile(createProfile, user.id);
  }

  @Get()
  async getProfile(@CurrentUser() user: any) {
    return this.profileService.getProfile(user.id);
  }

  @Put()
  async updateProfile(@CurrentUser() user: any, @Body() updateDto: UpdateProfileDto) {
    return this.profileService.updateProfile(updateDto, user.id);
  }

  @Post('avatar')
  async updateAvatar(@CurrentUser() user: any, @Body('avatarUrl') avatarUrl: string) {
    return this.profileService.updateAvatar(user.id, avatarUrl);
  }
}
