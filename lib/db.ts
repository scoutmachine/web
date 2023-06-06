import { Prisma, PrismaClient } from "@prisma/client";

const prismaClientPropertyName = `__prevent-name-collision__prisma`;
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient;
};

const getPrismaClient = (): PrismaClient<
  Prisma.PrismaClientOptions,
  Prisma.GetEvents<Prisma.LogLevel | Prisma.LogDefinition>,
  false
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
