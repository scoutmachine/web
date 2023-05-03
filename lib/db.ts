import { PrismaClient } from "@prisma/client";

interface Prisma {
  prisma: PrismaClient;
}

declare const global: Prisma;
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export { prisma as db };
