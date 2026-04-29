ALTER TABLE `invoices` ADD `items` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `invoices` DROP COLUMN `amount`;--> statement-breakpoint
ALTER TABLE `invoices` DROP COLUMN `currency`;