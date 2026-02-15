import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProfileDto } from "./dto/create-profile.dto";

//Crud Operations

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) { }

  async createProfile(createProfileDto: CreateProfileDto, userId: number) {
    const profile = await this.prisma.profile.create({
      data: {
        firstName: createProfileDto.firstName,
        lastName: createProfileDto.lastName,
        birthday: createProfileDto.birthday
          ? new Date(createProfileDto.birthday)
          : undefined,
        bio: createProfileDto.bio ?? null,
        address: createProfileDto.address ?? null,
        phoneNumber: createProfileDto.phoneNumber ?? null,
        user: {
          connect: { id: userId },
        },
      },
    });
    return { profile };
  }

  async getProfile(userId: number) {
    return this.prisma.profile.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });
  }

  async updateProfile(data: Partial<CreateProfileDto>, userId: number) {
    return this.prisma.profile.update({
      where: { userId: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data?.birthday ? new Date(data.birthday) : undefined,
        bio: data.bio,
        address: data.address,
        phoneNumber: data.phoneNumber,
      },
    });
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    return this.prisma.profile.update({
      where: { userId },
      data: { avatarUrl }
    });
  }
}
