export type InvoiceNumber = {
    year: number;
    currentNumber: number;
};

export type InvoiceItem = {
    description: string;
    quantity: number;
    unitPrice: number;
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type InvoiceStatusData = {
    status: InvoiceStatus;
    count: number;
};

export type MonthRevenue = {
    month: string;
    revenue: number;
};

export type TopStats = {
    totalRevenue: number;
    paidInvoices: number;
    pendingAmount: number;
    totalClients: number;
};

export type Invoice = {
    id: string;
    invoiceNumber: string;
    clientId: string;
    items: InvoiceItem[];
    taxRate: number;
    discount: number;
    status: InvoiceStatus;
    signature?: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    notes: string;
    createdAt: string;
};

export type DashboardStats = {
    topStats: TopStats;
    invoiceData: InvoiceStatusData[];
    monthlyRevenues: MonthRevenue[];
    recentInvoices: Invoice[];
};
