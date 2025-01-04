/*
  Warnings:

  - You are about to drop the `ConventionChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConventionChatHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ConventionChat` DROP FOREIGN KEY `ConventionChat_historyId_fkey`;

-- DropForeignKey
ALTER TABLE `ConventionChatHistory` DROP FOREIGN KEY `ConventionChatHistory_userId_fkey`;

-- DropTable
DROP TABLE `ConventionChat`;

-- DropTable
DROP TABLE `ConventionChatHistory`;

-- CreateTable
CREATE TABLE `CustomChatHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'New Custom Chat',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomChat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historyId` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomChatHistory` ADD CONSTRAINT `CustomChatHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomChat` ADD CONSTRAINT `CustomChat_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `CustomChatHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
