import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@shared/utils/prisma.util";
import { BiometricLoginDto } from "./dto/biometric-login.dto";
import { BiometricRegisterDto } from "./dto/biometric-register.dto";
import { SESSION_VALIDITY_MILLIS } from "@common/entities/constant";
import * as crypto from 'crypto';

@Injectable()
export class BiometricService {
  constructor(private readonly prisma: PrismaService) {}

  private verifyECDSASignature(base64PublicKey: string, base64Signature: string, challenge: string): boolean {
  const publicKeyBuffer = Buffer.from(base64PublicKey, 'base64');
  const signatureBuffer = Buffer.from(base64Signature, 'base64');

  // Create Public Key object
  const publicKey = crypto.createPublicKey({
    key: publicKeyBuffer,
    format: 'der',
    type: 'spki',
  });

  // Verify signature
  const isValid = crypto.verify(
    'sha256',
    Buffer.from(challenge),
    {
      key: publicKey,
      dsaEncoding: 'ieee-p1363', 
    },
    signatureBuffer
  );

  return isValid;
}

  async registerBiometrics(userId: string, registerDto: BiometricRegisterDto) {
    // todo: implement registering biometrics
    await this.prisma.biometricKeys.upsert({
      where: {
        userId,
        deviceId: registerDto.deviceId
      },
      create: {
        deviceId: registerDto.deviceId,
        publicKey: registerDto.publicKey,
        user: {
          connect: {
            userId
          }
        }
      },
      update: {
        publicKey: registerDto.publicKey
      }
    });

    return { message: 'Biometrics registered successfully' };
  }

  async requestLoginChallenge(deviceId: string) {
    // todo: implement requesting login challenge
    const challenge = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    const user = await this.prisma.biometricKeys.findUnique({
      where: {
        deviceId
      }
    });
    if (!user) 
      return {challenge}; //immediately return false challenge, do not reveal about user's existance

    await this.prisma.biometricKeys.update({
      where: {
        deviceId
      },
      data: {
        tempChallenge: challenge,
        challengeExpiresAt: new Date(Date.now() + 40 * 1000) // 40 seconds
      }
    });

    return {challenge};
  }

  async verifyBiometric({deviceId, challenge, signedChallenge}: BiometricLoginDto, deviceInfo: string) {
    // todo: implement verifying biometric
    const user = await this.prisma.biometricKeys.findUnique({
      where: {
        deviceId,
        tempChallenge: challenge
      },
      select: {
        user: true,
        publicKey: true
      }
    });
    if (!user) 
      throw new BadRequestException('Invalid biometric data');

    // verify the signed challenge signature
    const isValid = this.verifyECDSASignature(user.publicKey, signedChallenge, challenge);
    if (!isValid) 
      throw new UnauthorizedException('Biometric signature verification failed');

    // issue the session id once verified
    const session = await this.prisma.sessions.create({
      data: {
        userId: user.user.userId,
        deviceId,
        roles: user.user.roles as string[],
        deviceInfo,
        sessionToken: `${crypto.randomUUID()}-${crypto.randomUUID()}`,
        expiresAt: new Date(Date.now() + SESSION_VALIDITY_MILLIS),
      },
    });

    return {...user, ...session};
  }
}
