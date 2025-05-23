-- AlterTable
ALTER TABLE `Users` ADD COLUMN `contactVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false;
