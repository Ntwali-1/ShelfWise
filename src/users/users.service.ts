import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async allUsers() {
    console.log("Fetching all users");
    // return this.prisma.user.findMany();
  }

  async createUser(createUserDto: any) {
    console.log("Creating a new user");
    return this.prisma.user.create({
      data: {
        ...createUserDto
      }
    });  
  }
  
  async deleteUser(id: number) {
    console.log("Deleting user with id");
    // return this.prisma.user.delete({
    //   where: { id: id }
    // });  
  }
  
  async updateUser(id: number, updateUserDto: any) {
    console.log("Updating user");
  }
}