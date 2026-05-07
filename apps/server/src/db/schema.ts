import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { InvoiceItem } from "@/lib/types";

export const users = sqliteTable("users", {
    id: int("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    currentOrgId: int("currency_organization_id")
        .references(() => organizations.id)
        .notNull(),
    firstname: text("firstname"),
    lastname: text("lastname"),
    username: text("username").notNull(),
    deleted: int("deleted", { mode: "boolean" }).notNull().default(false),
    createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const organizations = sqliteTable("organizations", {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    type: text("type").notNull(),
    address: text("address"),
    city: text("city"),
    country: text("country"),
    website: text("website"),
    paystackCustomerCode: text("paystack_customer_code").notNull().unique(),
    paystackCustomerId: int("paystack_customer_id").notNull().unique(),
    paystackPlanId: int("paystack_plan_id").unique(),
    paystackPlanCode: text("paystack_plan_code").unique(),
    paystackSubscriptionCode: text("paystack_subscription_code").unique(),
    paystackEmailToken: text("paystack_email_token").unique(),
    deleted: int("deleted", { mode: "boolean" }).notNull().default(false),
    createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const members = sqliteTable("members", {
    id: int("id").primaryKey({ autoIncrement: true }),
    organizationId: int("organization_id")
        .references(() => organizations.id)
        .notNull(),
    userId: int("user_id")
        .references(() => users.id)
        .notNull(),
    roleId: int("role_id")
        .references(() => roles.id)
        .notNull(),
    startDate: int("start_date", { mode: "timestamp" }).default(sql`(unixepoch())`),
    endDate: int("end_date", { mode: "timestamp" }),
    deleted: int("deleted", { mode: "boolean" }).notNull().default(false),
    createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const roles = sqliteTable("roles", {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    permissions: text("permissions").notNull(),
    createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const clients = sqliteTable("clients", {
    id: text("id").primaryKey(),
    organizationId: int("organization_id").references(() => organizations.id),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    country: text("country"),
    deleted: int("deleted", { mode: "boolean" }).notNull().default(false),
    createdAt: int("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

export const invoices = sqliteTable("invoices", {
    id: text("id").primaryKey(),
    clientId: text("client_id")
        .references(() => clients.id)
        .notNull(),
    issueDate: int("issue_date", { mode: "timestamp" }).notNull(),
    dueDate: int("due_date", { mode: "timestamp" }).notNull(),
    status: text("status").notNull(),
    taxRate: int("tax_rate", { mode: "number" }).notNull().default(0),
    items: text("items", { mode: "json" })
        .$type<InvoiceItem[]>()
        .notNull()
        .default(sql`'[]'`),
    notes: text("notes"),
    currency: text("currency").notNull(),
    deleted: int("deleted", { mode: "boolean" }).notNull().default(false),
    createdAt: int("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});
