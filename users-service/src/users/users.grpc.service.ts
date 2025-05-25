import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/utils/prisma.util";

@Injectable()
export class UsersGrpcService {
    constructor(private readonly prisma: PrismaService) {}

    async registerUserProfile(userId: string) {
        await this.prisma.users.create({
            data: {
                userId,
            },
        });
        return {
            statusCode: 201,
        }
    }

    async getProfileInfo(userId: string) {
        return this.prisma.users.findUnique({
            where: {
                userId,
            },
        });
    }
}