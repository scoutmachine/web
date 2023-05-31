/*
  Warnings:

  - You are about to drop the `Webcast` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alliance" DROP CONSTRAINT "Alliance_event_key_fkey";

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropForeignKey
ALTER TABLE "Award" DROP CONSTRAINT "Award_event_key_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Webcast" DROP CONSTRAINT "Webcast_eventKey_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "webcasts" JSONB[];

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "district" TEXT;

-- DropTable
DROP TABLE "Webcast";

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[],
    "formId" INTEGER NOT NULL,

    CONSTRAINT "FormQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("team_number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_event_key_fkey" FOREIGN KEY ("event_key") REFERENCES "Event"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alliance" ADD CONSTRAINT "Alliance_event_key_fkey" FOREIGN KEY ("event_key") REFERENCES "Event"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
