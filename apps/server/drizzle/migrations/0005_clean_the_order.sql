PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text,
	`issued_date` integer NOT NULL,
	`due_date` integer NOT NULL,
	`status` text NOT NULL,
	`tax_rate` integer,
	`items` text DEFAULT '[]',
	`notes` text,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invoices`("id", "client_id", "issued_date", "due_date", "status", "tax_rate", "items", "notes", "deleted", "created_at", "updated_at") SELECT "id", "client_id", "issued_date", "due_date", "status", "tax_rate", "items", "notes", "deleted", "created_at", "updated_at" FROM `invoices`;--> statement-breakpoint
DROP TABLE `invoices`;--> statement-breakpoint
ALTER TABLE `__new_invoices` RENAME TO `invoices`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
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
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_clients`("id", "organization_id", "name", "email", "phone", "address", "city", "country", "deleted", "created_at", "updated_at") SELECT "id", "organization_id", "name", "email", "phone", "address", "city", "country", "deleted", "created_at", "updated_at" FROM `clients`;--> statement-breakpoint
DROP TABLE `clients`;--> statement-breakpoint
ALTER TABLE `__new_clients` RENAME TO `clients`;--> statement-breakpoint
CREATE TABLE `__new_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`role_id` integer NOT NULL,
	`start_date` integer DEFAULT (unixepoch()),
	`end_date` integer,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_members`("id", "organization_id", "user_id", "role_id", "start_date", "end_date", "deleted", "created_at", "updated_at") SELECT "id", "organization_id", "user_id", "role_id", "start_date", "end_date", "deleted", "created_at", "updated_at" FROM `members`;--> statement-breakpoint
DROP TABLE `members`;--> statement-breakpoint
ALTER TABLE `__new_members` RENAME TO `members`;