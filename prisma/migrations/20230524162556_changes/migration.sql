/*
  Warnings:

  - You are about to drop the column `eventKey` on the `Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_eventKey_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state_prov" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "eventKey",
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "nickname" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_EventToTeam" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventToTeam_AB_unique" ON "_EventToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToTeam_B_index" ON "_EventToTeam"("B");

-- AddForeignKey
ALTER TABLE "_EventToTeam" ADD CONSTRAINT "_EventToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToTeam" ADD CONSTRAINT "_EventToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("team_number") ON DELETE CASCADE ON UPDATE CASCADE;
