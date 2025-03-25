import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({
    where: {
      username: 'admin'
    }
  });

const plainPassword = 'adminpass'; // Store password as plain text
  
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: plainPassword,
      role: Role.ADMIN,
      status: 'ACTIVE'
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
