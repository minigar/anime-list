-- DropForeignKey
ALTER TABLE "Title" DROP CONSTRAINT "Title_userId_fkey";

-- AddForeignKey
ALTER TABLE "Title" ADD CONSTRAINT "Title_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
