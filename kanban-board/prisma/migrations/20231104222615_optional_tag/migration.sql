-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_tagId_fkey";

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "tagId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
