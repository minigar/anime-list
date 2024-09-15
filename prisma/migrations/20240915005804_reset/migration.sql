-- AlterTable
ALTER TABLE "Title" ADD COLUMN     "episodes" SMALLINT,
ADD COLUMN     "imgUrl" TEXT NOT NULL DEFAULT 'https://anime-list-bucket.s3.eu-north-1.amazonaws.com/default',
ADD COLUMN     "releasedEpisodes" SMALLINT NOT NULL DEFAULT 0;
