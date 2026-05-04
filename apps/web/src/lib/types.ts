export type Client = {
    id: string;
    organizationId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    createdAt: string;
};

export type Currency = {
    symbol: string;
    locale: string;
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

export type Invoice = {
    id: number;
    invoiceNumber: string;
    clientId: string;
    client: Client;
    items: InvoiceItem[];
    taxRate: number;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    currency: string;
    notes: string;
    createdAt: string;
};

export type DashboardStats = {
    totalRevenue: number;
    paidInvoices: number;
    pendingAmount: number;
    totalClients: number;
};

export type User = {
    username: string;
    email: string;
    organizationName: string;
};

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    login: (email: string) => Promise<boolean>;
    logout: () => void;
    refreshToken: () => Promise<AuthResponse>;
    verifyOtp: (otp: string) => Promise<boolean>;
    authenticate: () => Promise<boolean>;
}

export interface Context {
    auth: AuthState | undefined;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export type SignupFormField =
    | "firstname"
    | "lastname"
    | "email"
    | "username"
    | "businessName"
    | "businessType"
    | "website"
    | "businessAddress"
    | "city"
    | "country";

export type MonthRevenue = {
    month: string;
    revenue: number;
};
