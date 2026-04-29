CREATE TABLE IF NOT EXISTS `roles` (
   	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`permissions` text NOT NULL,
   	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);

INSERT INTO `roles` (`name`, `permissions`) VALUES
    ('superadmin', 'all'),
    ('admin', 'all'),
    ('user', 'read'),
    ('guest', 'none')
ON CONFLICT(`name`) DO NOTHING;
