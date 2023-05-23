-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "comp_level" TEXT NOT NULL,
    "set_number" INTEGER NOT NULL,
    "match_number" INTEGER NOT NULL,
    "alliances" JSONB,
    "winning_alliance" TEXT NOT NULL,
    "event_key" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "actual_time" INTEGER NOT NULL,
    "predicted_time" INTEGER NOT NULL,
    "post_result_time" INTEGER NOT NULL,
    "score_breakdown" JSONB,
    "videos" JSONB,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_key_key" ON "Match"("key");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_event_key_fkey" FOREIGN KEY ("event_key") REFERENCES "Event"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
