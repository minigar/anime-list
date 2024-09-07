/*
  Warnings:

  - You are about to drop the column `year_premiered` on the `Title` table. All the data in the column will be lost.
  - Added the required column `premiereYear` to the `Title` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Title" DROP COLUMN "year_premiered",
ADD COLUMN     "premiereYear" SMALLINT NOT NULL;
