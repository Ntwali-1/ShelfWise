import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async createProfile(data: any, userId: number) {
    const profile = await this.prisma.profile.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data.birthday,
        bio: data.bio,
        address: data.address,
        phoneNumber: data.phoneNumber,
        user: {
        connect: { id: userId }, 
      },
      }
    })
    return { profile };
  }

  async getProfile(userId: number) {
    return this.prisma.profile.findUnique({
      where: { userId: userId },
    });
  }

  async updateProfile(data: any, userId: number) {
    return this.prisma.profile.update({
      where: { userId: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data.birthday,
        bio: data.bio,
        address: data.address,
        phoneNumber: data.phoneNumber,
      }
    });
  }
}