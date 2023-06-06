-- AlterTable
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "key" DROP NOT NULL,
ALTER COLUMN "comp_level" DROP NOT NULL,
ALTER COLUMN "set_number" DROP NOT NULL,
ALTER COLUMN "match_number" DROP NOT NULL,
ALTER COLUMN "winning_alliance" DROP NOT NULL,
ALTER COLUMN "time" DROP NOT NULL,
ALTER COLUMN "time" SET DATA TYPE BIGINT,
ALTER COLUMN "actual_time" DROP NOT NULL,
ALTER COLUMN "actual_time" SET DATA TYPE BIGINT,
ALTER COLUMN "predicted_time" DROP NOT NULL,
ALTER COLUMN "predicted_time" SET DATA TYPE BIGINT,
ALTER COLUMN "post_result_time" DROP NOT NULL,
ALTER COLUMN "post_result_time" SET DATA TYPE BIGINT;

-- CreateTable
CREATE TABLE "Award" (
    "id" SERIAL NOT NULL,
    "award_type" INTEGER NOT NULL,
    "event_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recipient_list" JSONB,
    "year" INTEGER NOT NULL,
    "person" TEXT
);

-- CreateTable
CREATE TABLE "Alliance" (
    "id" SERIAL NOT NULL,
    "event_key" TEXT NOT NULL,
    "declines" TEXT[],
    "name" TEXT NOT NULL,
    "picks" TEXT[],
    "status" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "Award_id_key" ON "Award"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Alliance_id_key" ON "Alliance"("id");

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_event_key_fkey" FOREIGN KEY ("event_key") REFERENCES "Event"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alliance" ADD CONSTRAINT "Alliance_event_key_fkey" FOREIGN KEY ("event_key") REFERENCES "Event"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
