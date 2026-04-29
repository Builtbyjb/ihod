-- Custom SQL migration file, put your code below! --
INSERT INTO ROLES (name, permissions, created_at, updated_at)
VALUES
('super_admin', 'super_admin', datetime('now'), datetime('now')),
('admin', 'admin', datetime('now'), datetime('now')),
('member', 'member', datetime('now'), datetime('now'));
