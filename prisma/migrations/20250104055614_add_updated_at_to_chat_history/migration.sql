/*
  Warnings:

  - Added the required column `updatedAt` to the `CustomChatHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StudyChatHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CustomChatHistory` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `StudyChatHistory` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
