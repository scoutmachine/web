-- DropForeignKey
ALTER TABLE "FavouritedEvent" DROP CONSTRAINT "FavouritedEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavouritedTeam" DROP CONSTRAINT "FavouritedTeam_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Team" (
    "team_number" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_number")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" SERIAL NOT NULL,
    "handle" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "teamId" INTEGER,
    "userId" TEXT,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "event_code" TEXT NOT NULL,
    "event_type" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "state_prov" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "short_name" TEXT,
    "event_type_string" TEXT NOT NULL,
    "week" INTEGER,
    "address" TEXT,
    "postal_code" TEXT,
    "gmaps_place_id" TEXT,
    "gmaps_url" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "location_name" TEXT,
    "timezone" TEXT,
    "website" TEXT,
    "first_event_id" TEXT,
    "first_event_code" TEXT,
    "division_keys" TEXT[],
    "parent_event_key" TEXT,
    "playoff_type" INTEGER,
    "playoff_type_string" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_team_number_key" ON "Team"("team_number");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouritedTeam" ADD CONSTRAINT "FavouritedTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouritedEvent" ADD CONSTRAINT "FavouritedEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("team_number") ON DELETE CASCADE ON UPDATE CASCADE;
