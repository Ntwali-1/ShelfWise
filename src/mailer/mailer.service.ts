import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { from } from "rxjs";

@Injectable()
export class MailerService {
  private transporter;
  constructor() {}
  async sendOtpMail(email: string, otp: string) {
    this.transporter = nodemailer.createTransport({
      service:"gmail",
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS
      }
    });

    const mailOptions = {
      from : process.env.EMAILUSER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
    }
    return from(this.transporter.sendMail(mailOptions));
  } 
}