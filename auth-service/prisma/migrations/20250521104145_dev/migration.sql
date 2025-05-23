-- CreateTable
CREATE TABLE `Users` (
    `userId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,
    `multiAuth` ENUM('NONE', 'PHONE', 'EMAIL') NOT NULL DEFAULT 'NONE',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_contact_key`(`contact`),
    INDEX `Users_username_email_contact_idx`(`username`, `email`, `contact`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sessions` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,
    `deviceInfo` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `expiresAt` TIMESTAMP(3) NOT NULL,

    UNIQUE INDEX `Sessions_sessionId_key`(`sessionId`),
    INDEX `Sessions_sessionId_idx`(`sessionId`),
    INDEX `Sessions_userId_idx`(`userId`),
    INDEX `Sessions_userId_sessionId_idx`(`userId`, `sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BiometricKeys` (
    `keyId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `publicKey` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `tempChallenge` VARCHAR(191) NULL,
    `challengeExpiresAt` TIMESTAMP(3) NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `BiometricKeys_publicKey_key`(`publicKey`),
    UNIQUE INDEX `BiometricKeys_deviceId_key`(`deviceId`),
    UNIQUE INDEX `BiometricKeys_tempChallenge_key`(`tempChallenge`),
    INDEX `BiometricKeys_deviceId_idx`(`deviceId`),
    INDEX `BiometricKeys_deviceId_tempChallenge_idx`(`deviceId`, `tempChallenge`),
    PRIMARY KEY (`keyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BiometricKeys` ADD CONSTRAINT `BiometricKeys_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
