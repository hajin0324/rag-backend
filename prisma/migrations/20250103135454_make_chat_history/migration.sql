/*
  Warnings:

  - You are about to drop the column `userId` on the `ConventionChat` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `StudyChat` table. All the data in the column will be lost.
  - Added the required column `historyId` to the `ConventionChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `historyId` to the `StudyChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ConventionChat` DROP FOREIGN KEY `ConventionChat_userId_fkey`;

-- DropForeignKey
ALTER TABLE `StudyChat` DROP FOREIGN KEY `StudyChat_userId_fkey`;

-- AlterTable
ALTER TABLE `ConventionChat` DROP COLUMN `userId`,
    ADD COLUMN `historyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `StudyChat` DROP COLUMN `userId`,
    ADD COLUMN `historyId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `StudyChatHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'New Chat',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConventionChatHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'New Convention Chat',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudyChatHistory` ADD CONSTRAINT `StudyChatHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyChat` ADD CONSTRAINT `StudyChat_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `StudyChatHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConventionChatHistory` ADD CONSTRAINT `ConventionChatHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConventionChat` ADD CONSTRAINT `ConventionChat_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `ConventionChatHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
