/*
  Warnings:

  - Added the required column `country` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "webcasts" JSONB;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "eventKey" TEXT,
ADD COLUMN     "gmaps_place_id" TEXT,
ADD COLUMN     "gmaps_url" TEXT,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "lat" INTEGER,
ADD COLUMN     "lng" INTEGER,
ADD COLUMN     "location_name" TEXT,
ADD COLUMN     "motto" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "postal_code" TEXT,
ADD COLUMN     "rookie_year" INTEGER,
ADD COLUMN     "school_name" TEXT,
ADD COLUMN     "state_prov" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_eventKey_fkey" FOREIGN KEY ("eventKey") REFERENCES "Event"("key") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
