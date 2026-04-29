CREATE TABLE `clients` (
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
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text,
	`issue_date` integer NOT NULL,
	`due_date` integer NOT NULL,
	`status` text NOT NULL,
	`tax_rate` integer,
	`items` text DEFAULT '[]',
	`notes` text,
	`currency` text NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `members` (
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
CREATE TABLE `organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`address` text,
	`city` text,
	`country` text,
	`website` text,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_name_unique` ON `organizations` (`name`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`permissions` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`currency_organization_id` integer NOT NULL,
	`firstname` text,
	`lastname` text,
	`username` text NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`currency_organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
