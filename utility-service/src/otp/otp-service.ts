import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/utils/prisma.util";

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  async generateOtp(sentTo: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await this.prisma.otps.create({
      data: {
        sentTo,
        otp: otp.toString(),
        expiresAt: new Date(Date.now() + 3 * 60 * 1000), // 3 mins
      },
    });

    return otp;
  }

  async verifyOtp(sentTo: string, otp: string) {
    const otpRecord = await this.prisma.otps.findFirst({
      where: {
        sentTo,
        otp,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otpRecord) return null;

    await this.prisma.otps.delete({
      where: {
        id: otpRecord.id,
      },
    });

    return otpRecord;
  }
}