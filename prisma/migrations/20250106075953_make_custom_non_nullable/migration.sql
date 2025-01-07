/*
  Warnings:

  - Made the column `custom` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `custom` VARCHAR(191) NOT NULL DEFAULT 'default';
