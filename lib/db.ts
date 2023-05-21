import { Prisma, PrismaClient } from "@prisma/client";

const prismaClientPropertyName = `__prevent-name-collision__prisma`;
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient;
};

// @ts-ignore
const getPrismaClient = (): PrismaClient<
  Prisma.PrismaClientOptions,
  "log" extends keyof Prisma.PrismaClientOptions
    ? Prisma.PrismaClientOptions["log"] extends Array<
        Prisma.LogLevel | Prisma.LogDefinition
      >
      ? Prisma.GetEvents<Prisma.PrismaClientOptions["log"]>
      : never
    : never,
  "rejectOnNotFound" extends keyof Prisma.PrismaClientOptions
    ? Prisma.PrismaClientOptions["rejectOnNotFound"]
    : false
> => {
  if (process.env.NODE_ENV === `production`) {
    return new PrismaClient();
  } else {
    const newGlobalThis: GlobalThisWithPrismaClient =
      globalThis as GlobalThisWithPrismaClient;
    if (!newGlobalThis[prismaClientPropertyName]) {
      newGlobalThis[prismaClientPropertyName] = new PrismaClient();
    }
    return newGlobalThis[prismaClientPropertyName];
  }
};

const db: PrismaClient = getPrismaClient();

export default db;
