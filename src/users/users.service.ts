import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async createUser(createUserDto: any) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return this.prisma.user.create({
      data: {
        otp: otp,
        otpExpiration: new Date(Date.now() + 10 * 60 * 1000),
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      }
    });  
  }

  async verifyUser(createUserDto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    });
    if (!user) {
      throw new Error("User not found");
    }else if (user.otp !== createUserDto.otp) {
      throw new Error("Invalid OTP");
    }else if (!user.otpExpiration || user.otpExpiration < new Date()) {
      throw new Error("OTP expired");
    }else{
      await this.prisma.user.update({
        where: { email: createUserDto.email },
        data: {
          otp: null,
          otpExpiration: null,
        }
      });
      return { message: "User verified successfully" };
    }
  }

  async loginUser(loginUserDto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email }
    });
    
    if (!user) {
      throw new NotFoundException("User not found");
    }
    
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }
    
    const payload = { sub: user.id, email: user.email };
    const token = this.jwt.sign(payload);
    return { token };
  }
}