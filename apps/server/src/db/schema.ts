import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { InvoiceItem } from "@/lib/types";

export const users = sqliteTable("users", {
    id: int("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    firstname: text("firstname"),
    lastname: text("lastname"),
    username: text("username"),
    setupCompleted: int("setup_completed", { mode: "boolean" })
        .notNull()
        .default(false),
    deleted: int("deleted", { mode: "boolean" }).notNull().default(false),
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
    address: text("address"),
    currency: text("address"),
    city: text("city"),
    country: text("country"),
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
    startDate: int("start_date", { mode: "timestamp" }).default(
        sql`(unixepoch())`,
    ),
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

export const clients = sqliteTable("clients", {
    id: int("id").primaryKey({ autoIncrement: true }),
    organizationId: int("organization_id").references(() => organizations.id),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    country: text("country"),
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
    status: text("status").notNull(),
    taxRate: int("tax_rate", { mode: "number" }),
    items: text("items", { mode: "json" }).$type<InvoiceItem[]>().default([]),
    notes: text("notes"),
    createdAt: int("created_at", { mode: "timestamp" }).default(
        sql`(unixepoch())`,
    ),
    updatedAt: int("updated_at", { mode: "timestamp" }).default(
        sql`(unixepoch())`,
    ),
});
