/*
  Warnings:

  - You are about to alter the column `status` on the `purchase` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `purchase` ADD COLUMN `cancelledAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
