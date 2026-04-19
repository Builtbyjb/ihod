import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  firstname: text("firstname"),
  lastname: text("lastname"),
  username: text("username"),
  setupCompleted: int("setup_completed", { mode: "boolean" }),
  deleted: int("deleted", { mode: "boolean" }),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
});

export const organizations = sqliteTable("organizations", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  addressId: int("address_id").references(() => address.id),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
});

export const members = sqliteTable("members", {
  id: int("id").primaryKey({ autoIncrement: true }),
  organizationId: int("organization_id").references(() => organizations.id),
  userId: int("user_id").references(() => users.id),
  roleId: int("role_id").references(() => roles.id),
  startDate: int("start_date", { mode: "timestamp" }).notNull(),
  endDate: int("end_date", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
});

export const roles = sqliteTable("roles", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  permissions: text("permissions").notNull(),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
});

// TODO
export const address = sqliteTable("address", {
  id: int("id").primaryKey({ autoIncrement: true }),
});

export const clients = sqliteTable("clients", {
  id: int("id").primaryKey({ autoIncrement: true }),
  organizationId: int("organization_id").references(() => organizations.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  addressId: int("address_id").references(() => address.id),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
});

export const invoices = sqliteTable("invoices", {
  id: int("id").primaryKey({ autoIncrement: true }),
  invoiceNumber: text("invoice_number").notNull(),
  clientId: int("client_id").references(() => clients.id),
  organizationId: int("organization_id").references(() => organizations.id),
  issuedDate: int("issued_date", { mode: "timestamp" }).notNull(),
  dueDate: int("due_date", { mode: "timestamp" }).notNull(),
  amount: int("amount", { mode: "number" }).notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  currency: text("currency").notNull(),
  taxRate: int("tax_rate", { mode: "number" }),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
});
