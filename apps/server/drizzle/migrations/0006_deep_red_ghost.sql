ALTER TABLE `organizations` ADD `currency` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_name_unique` ON `organizations` (`name`);--> statement-breakpoint
ALTER TABLE `users` ADD `currency_organization_id` integer NOT NULL REFERENCES organizations(id);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `setup_completed`;