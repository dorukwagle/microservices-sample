-- CreateTable
CREATE TABLE `Sessions` (
    `sessionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Sessions_sessionToken_key`(`sessionToken`),
    INDEX `Sessions_sessionToken_expiresAt_idx`(`sessionToken`, `expiresAt`),
    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
