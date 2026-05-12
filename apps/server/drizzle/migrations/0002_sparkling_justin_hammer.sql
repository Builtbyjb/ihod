PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` integer,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`address` text,
	`city` text,
	`country` text,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_clients`("id", "organization_id", "name", "email", "phone", "address", "city", "country", "deleted", "created_at", "updated_at") SELECT "id", "organization_id", "name", "email", "phone", "address", "city", "country", "deleted", "created_at", "updated_at" FROM `clients`;--> statement-breakpoint
DROP TABLE `clients`;--> statement-breakpoint
ALTER TABLE `__new_clients` RENAME TO `clients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`issue_date` integer NOT NULL,
	`due_date` integer NOT NULL,
	`status` text NOT NULL,
	`tax_rate` integer DEFAULT 0 NOT NULL,
	`items` text DEFAULT '[]' NOT NULL,
	`notes` text,
	`currency` text NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invoices`("id", "client_id", "issue_date", "due_date", "status", "tax_rate", "items", "notes", "currency", "deleted", "created_at", "updated_at") SELECT "id", "client_id", "issue_date", "due_date", "status", "tax_rate", "items", "notes", "currency", "deleted", "created_at", "updated_at" FROM `invoices`;--> statement-breakpoint
DROP TABLE `invoices`;--> statement-breakpoint
ALTER TABLE `__new_invoices` RENAME TO `invoices`;--> statement-breakpoint
ALTER TABLE `organizations` ADD `paystack_customer_code` text NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD `paystack_customer_id` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD `paystack_subscription_status` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_paystack_customer_code_unique` ON `organizations` (`paystack_customer_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_paystack_customer_id_unique` ON `organizations` (`paystack_customer_id`);