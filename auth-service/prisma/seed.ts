import { hashPassword } from "@shared/utils/hash.util";
import { AccountStatus, PrismaClient, UserRole } from "generated/prisma";


const prisma = new PrismaClient();

async function main() {
  await prisma.users.createMany({
    data: [
      {
        userId: Buffer.from('Hello World!, Ohh, farewell...').toString('base64'),
        username: 'doruk',
        password: await hashPassword('password123'),
        email: 'dorukwagle@gmail.com',
        contact: '+9779829293466',
        roles: [UserRole.USER],
        status: AccountStatus.ACTIVE,
        contactVerified: true,
        emailVerified: true,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
