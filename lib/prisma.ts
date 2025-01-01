import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

// globalThis.prisma : This global variable ensures that the Prisma Client instance is reused across hot reloads during the development. Without this, each time your application reloads, a new instance of the Prisma Client would be created, potentially leading to connection issues.