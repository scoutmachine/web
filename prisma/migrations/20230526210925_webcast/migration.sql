/*
  Warnings:

  - You are about to drop the column `webcasts` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "webcasts";

-- CreateTable
CREATE TABLE "Webcast" (
    "id" SERIAL NOT NULL,
    "channel" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TEXT,
    "file" TEXT,
    "eventKey" TEXT,

    CONSTRAINT "Webcast_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Webcast" ADD CONSTRAINT "Webcast_eventKey_fkey" FOREIGN KEY ("eventKey") REFERENCES "Event"("key") ON DELETE SET NULL ON UPDATE CASCADE;
