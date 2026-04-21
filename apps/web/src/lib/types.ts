export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    createdAt: string;
}

export interface InvoiceItem {
    id: string,
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    clientId: string;
    client: Client;
    items: InvoiceItem[];
    taxRate: number;
    status: "draft" | "sent" | "paid" | "overdue";
    issueDate: string;
    dueDate: string;
    notes: string;
    createdAt: string;
}

export interface DashboardStats {
    totalRevenue: number;
    paidInvoices: number;
    pendingAmount: number;
    totalClients: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    login: (email: string) => Promise<boolean>;
    logout: () => void;
    refreshToken: () => Promise<AuthResponse>;
    verifyOtp: (otp: string) => Promise<OTPResponse>;
}

export interface Context {
    auth: AuthState | undefined;
}

export interface AuthResponse {
    accessToken: string;
}

export interface OTPResponse extends AuthResponse {
    setupCompleted: boolean;
}
