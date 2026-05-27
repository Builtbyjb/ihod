import { forwardRef } from "react";
import type { Client } from "@/lib/types";
import type { Invoice, InvoiceItem } from "@shared/lib/types";
import { format } from "date-fns";
import { calculateDiscount, formatCurrency } from "@/lib/utils";
import { calculateSubTotal, calculateTaxAmount, calculateTotalAmount } from "@/lib/utils";
import { APP_NAME } from "@/lib/constant";

type InvoicePDFProps = {
  invoice: Invoice;
  client: Client | null;
  bussinessname?: string;
  logoURL: string | null;
};

export const DefaultInvoiceTemplate = forwardRef<HTMLDivElement, InvoicePDFProps>(
  ({ invoice, client, bussinessname, logoURL }, ref) => (
    <main ref={ref} className="bg-white w-[210mm] min-h-[290mm] mx-auto p-[10mm] text-gray-900 print:p-[10mm]">
      <div className="h-full flex flex-col justify-between">
        {/* Top Content */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              {logoURL && <img src={logoURL} alt="Business Logo" className="w-16 h-16 object-contain mb-2" />}
              <p className="text-2xl font-medium">{bussinessname}</p>
            </div>
            <div className="text-right text-sm space-y-0.5">
              <p className="font-semibold text-lg"> #{invoice.invoiceNumber}</p>
              <p>Issue: {format(new Date(invoice.issueDate), "MMM d, yyyy")}</p>
              <p>Due: {format(new Date(invoice.dueDate), "MMM d, yyyy")}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Bill To</p>
            {client && (
              <div className="space-y-0.5 text-sm">
                <p className="font-medium text-base">{client.name}</p>
                <p>{client.email}</p>
                {client.phone && <p>{client.phone}</p>}
                {client.address && <p>{client.address}</p>}
                <p>
                  {client.city}, {client.country}
                </p>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="w-full">
            <div className="grid grid-cols-4 bg-gray-100 text-gray-600 text-sm font-semibold py-3 px-4 rounded-t-lg">
              <p>Description</p>
              <p className="text-center">Qty</p>
              <p className="text-right">Unit</p>
              <p className="text-right">Amount</p>
            </div>

            {invoice.items.map((item: InvoiceItem, index) => (
              <div key={index} className="grid grid-cols-4 py-3 border-b text-sm">
                <p>{item.description}</p>
                <p className="text-center">{item.quantity}</p>
                <p className="text-right">{formatCurrency(item.unitPrice, invoice.currency)}</p>
                <p className="text-right font-medium">
                  {formatCurrency(item.quantity * item.unitPrice, invoice.currency)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-75 space-y-2 text-sm">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{formatCurrency(calculateSubTotal(invoice.items), invoice.currency)}</p>
              </div>
              <div className="flex justify-between">
                <p>Discount ({invoice.discount}%)</p>
                <p>
                  {formatCurrency(
                    calculateDiscount(calculateSubTotal(invoice.items), invoice.discount),
                    invoice.currency,
                  )}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Tax ({invoice.taxRate}%)</p>
                <p>
                  {formatCurrency(
                    calculateTaxAmount(calculateSubTotal(invoice.items), invoice.taxRate),
                    invoice.currency,
                  )}
                </p>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <p>Total</p>
                <p>
                  {formatCurrency(
                    calculateTotalAmount(invoice.items, invoice.taxRate, invoice.discount),
                    invoice.currency,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Notes</p>
              <p className="text-sm">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Signatures</p>
          <div className="grid grid-cols-2 gap-12 mb-8">
            <div className="text-center">
              {invoice.signature && (
                <img src={invoice.signature} loading="eager" alt="User Signature" className="w-full h-16" />
              )}
              <div className={`border-t pt-2 text-sm ${invoice.signature ? "mt-4" : "mt-20"}`}>{bussinessname}</div>
            </div>
            <div className="text-center">
              <div className="border-t mt-20 pt-2 text-sm">{client?.name}</div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600">Thank you for your business! | Generated by {APP_NAME}</p>
        </div>
      </div>
    </main>
  ),
);
