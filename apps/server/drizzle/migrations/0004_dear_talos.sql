ALTER TABLE `clients` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `members` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD `deleted` integer DEFAULT false NOT NULL;