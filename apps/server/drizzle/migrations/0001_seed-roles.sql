-- Custom SQL migration file, put your code below! --
CREATE TABLE IF NOT EXISTS ROLES (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    permissions TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ROLES (name, permissions, created_at, updated_at)
VALUES
('super_admin', 'super_admin', datetime('now'), datetime('now')),
('admin', 'admin', datetime('now'), datetime('now')),
('member', 'member', datetime('now'), datetime('now'));
