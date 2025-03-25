import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminUsers = await prisma.user.findMany({
    where: { role: 'ADMIN' }
  })
  console.log('Admin users:', adminUsers)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
