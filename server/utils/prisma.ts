import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@@/prisma/generated/client'

const prismaClientSingleton = () => {
  const pool = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter: pool })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prismaClient = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient
