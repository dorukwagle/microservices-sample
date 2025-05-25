import { PrismaClient } from "generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.createMany({
    data: [
      {
        userId: Buffer.from('Hello World!, Ohh, farewell...').toString(
          'base64',
        ),
        fullName: 'Doruk Wagle',
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
