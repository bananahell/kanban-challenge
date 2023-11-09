/*
  Warnings:

  - You are about to drop the `_board-users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_board-users" DROP CONSTRAINT "_board-users_A_fkey";

-- DropForeignKey
ALTER TABLE "_board-users" DROP CONSTRAINT "_board-users_B_fkey";

-- DropTable
DROP TABLE "_board-users";

-- CreateTable
CREATE TABLE "_board-admins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_board-members" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_board-visitors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_board-admins_AB_unique" ON "_board-admins"("A", "B");

-- CreateIndex
CREATE INDEX "_board-admins_B_index" ON "_board-admins"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_board-members_AB_unique" ON "_board-members"("A", "B");

-- CreateIndex
CREATE INDEX "_board-members_B_index" ON "_board-members"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_board-visitors_AB_unique" ON "_board-visitors"("A", "B");

-- CreateIndex
CREATE INDEX "_board-visitors_B_index" ON "_board-visitors"("B");

-- AddForeignKey
ALTER TABLE "_board-admins" ADD CONSTRAINT "_board-admins_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_board-admins" ADD CONSTRAINT "_board-admins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_board-members" ADD CONSTRAINT "_board-members_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_board-members" ADD CONSTRAINT "_board-members_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_board-visitors" ADD CONSTRAINT "_board-visitors_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_board-visitors" ADD CONSTRAINT "_board-visitors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
