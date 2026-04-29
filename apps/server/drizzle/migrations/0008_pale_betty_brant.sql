ALTER TABLE `invoices` ADD `currency` text NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD `website` text;--> statement-breakpoint
ALTER TABLE `organizations` DROP COLUMN `currency`;