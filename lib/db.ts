import { PrismaClient } from "@prisma/client";

interface Prisma {
  prisma: PrismaClient;
}

declare const global: Prisma;

export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = db;
