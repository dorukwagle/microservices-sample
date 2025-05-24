import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/utils/prisma.util";


@Injectable()
export class AuthCrudGrpcService {
    constructor(private readonly prisma: PrismaService) {}
    
    async getAuthInfo(userId: string) {
        return this.prisma.users.findUnique({
            where: { userId },
            select: {
                userId: true,
                username: true,
                email: true,
                contact: true,
                roles: true,
                contactVerified: true,
                emailVerified: true,
                multiAuth: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}