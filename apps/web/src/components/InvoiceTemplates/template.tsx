import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Client } from "@/lib/types";
import type { Invoice, InvoiceItem } from "@shared/lib/types";
import { formatCurrency } from "@/lib/utils";
import { calculateDiscount, calculateSubTotal, calculateTaxAmount, calculateTotalAmount } from "@shared/utils/util";
import { APP_NAME } from "@/lib/constant";

// ---------------------------------------------------------------------------
// Optional: register a custom font if you use one in your app.
// Remove this block if you are happy with the default (Helvetica).
// ---------------------------------------------------------------------------
// Font.register({
//   family: "Inter",
//   fonts: [
//     { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
//     { src: "/fonts/Inter-Medium.ttf",  fontWeight: 500 },
//     { src: "/fonts/Inter-Bold.ttf",    fontWeight: 700 },
//   ],
// });

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const c = {
  white: "#ffffff",
  gray900: "#111827",
  gray600: "#4b5563",
  gray500: "#6b7280",
  gray100: "#f3f4f6",
  gray50: "#f9fafb",
  border: "#e5e7eb",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: c.gray900,
    backgroundColor: c.white,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
  },

  // ---- Layout shells ----
  column: { flexDirection: "column" },
  row: { flexDirection: "row" },
  spaceBetween: { flexDirection: "row", justifyContent: "space-between" },
  flex1: { flex: 1 },

  // ---- Header ----
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    paddingBottom: 16,
    marginBottom: 16,
  },
  logo: { width: 48, height: 48, borderRadius: 24, objectFit: "contain", marginBottom: 6 },
  businessName: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  invoiceNumber: { fontSize: 12, fontFamily: "Helvetica-Bold", textAlign: "right" },
  headerMeta: { fontSize: 9, color: c.gray600, textAlign: "right", marginTop: 2 },

  // ---- Bill To ----
  billToBox: {
    backgroundColor: c.gray50,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: c.gray500,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  clientName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  clientMeta: { fontSize: 9, color: c.gray600, marginBottom: 1 },

  // ---- Table ----
  tableHeader: {
    flexDirection: "row",
    backgroundColor: c.gray100,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: c.gray600,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  tableRowText: { fontSize: 9, color: c.gray900 },

  // Column widths (must sum to ~100%)
  colDesc: { flex: 2.4 },
  colQty: { flex: 0.8, textAlign: "center" },
  colUnit: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },

  // ---- Totals ----
  totalsWrapper: { alignItems: "flex-end", marginTop: 10 },
  totalsBox: { width: 200 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalsLabel: { fontSize: 9, color: c.gray600 },
  totalsValue: { fontSize: 9, color: c.gray900 },
  totalsFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingTop: 6,
    marginTop: 4,
  },
  totalsFinalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  totalsFinalValue: { fontSize: 12, fontFamily: "Helvetica-Bold" },

  // ---- Notes ----
  notesWrapper: { marginTop: 14 },
  notesText: { fontSize: 9, color: c.gray600 },

  // ---- Signatures ----
  signaturesWrapper: { marginTop: "auto", paddingTop: 20 },
  signaturesGrid: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 20,
  },
  signatureBlock: { flex: 1, alignItems: "center" },
  signatureImage: { width: "100%", height: 48, objectFit: "contain" },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingTop: 5,
    marginTop: 6,
    width: "100%",
    textAlign: "center",
    fontSize: 9,
    color: c.gray900,
  },

  // ---- Footer ----
  footer: {
    textAlign: "center",
    fontSize: 8,
    color: c.gray600,
    marginTop: 10,
  },
});

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TableRow({ item, currency }: { item: InvoiceItem; currency: string }) {
  return (
    <View style={s.tableRow}>
      <Text style={[s.tableRowText, s.colDesc]}>{item.description}</Text>
      <Text style={[s.tableRowText, s.colQty]}>{item.quantity}</Text>
      <Text style={[s.tableRowText, s.colUnit]}>{formatCurrency(item.unitPrice, currency)}</Text>
      <Text style={[s.tableRowText, s.colAmount]}>{formatCurrency(item.quantity * item.unitPrice, currency)}</Text>
    </View>
  );
}

function TotalsRow({ label, value, final = false }: { label: string; value: string; final?: boolean }) {
  if (final) {
    return (
      <View style={s.totalsFinalRow}>
        <Text style={s.totalsFinalLabel}>{label}</Text>
        <Text style={s.totalsFinalValue}>{value}</Text>
      </View>
    );
  }
  return (
    <View style={s.totalsRow}>
      <Text style={s.totalsLabel}>{label}</Text>
      <Text style={s.totalsValue}>{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main document component
// ---------------------------------------------------------------------------

type Props = {
  invoice: Invoice;
  client: Client | null;
  bussinessname?: string;
  logoURL?: string;
  signature?: string;
};

export function DefaultInvoicePDF({ invoice, client, bussinessname, logoURL, signature }: Props) {
  const subtotal = calculateSubTotal(invoice.items);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ---- Header ---- */}
        <View style={s.header}>
          <View style={s.column}>
            {logoURL && <Image style={s.logo} src={logoURL} />}
            {bussinessname && <Text style={s.businessName}>{bussinessname}</Text>}
          </View>
          <View style={s.column}>
            <Text style={s.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            <Text style={s.headerMeta}>Issue: {format(new Date(invoice.issueDate), "MMM d, yyyy")}</Text>
            <Text style={s.headerMeta}>Due: {format(new Date(invoice.dueDate), "MMM d, yyyy")}</Text>
          </View>
        </View>

        {/* ---- Bill To ---- */}
        {client && (
          <View style={s.billToBox}>
            <Text style={s.sectionLabel}>Bill To</Text>
            <Text style={s.clientName}>{client.name}</Text>
            <Text style={s.clientMeta}>{client.email}</Text>
            {client.phone && <Text style={s.clientMeta}>{client.phone}</Text>}
            {client.address && <Text style={s.clientMeta}>{client.address}</Text>}
            <Text style={s.clientMeta}>
              {client.city}, {client.country}
            </Text>
          </View>
        )}

        {/* ---- Items Table ---- */}
        <View>
          {/* Table header */}
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderText, s.colDesc]}>Description</Text>
            <Text style={[s.tableHeaderText, s.colQty]}>Qty</Text>
            <Text style={[s.tableHeaderText, s.colUnit]}>Unit</Text>
            <Text style={[s.tableHeaderText, s.colAmount]}>Amount</Text>
          </View>

          {/* Table rows */}
          {invoice.items.map((item: InvoiceItem, index: number) => (
            <TableRow key={index} item={item} currency={invoice.currency} />
          ))}
        </View>

        {/* ---- Totals ---- */}
        <View style={s.totalsWrapper}>
          <View style={s.totalsBox}>
            <TotalsRow label="Subtotal" value={formatCurrency(subtotal, invoice.currency)} />
            <TotalsRow
              label={`Discount (${invoice.discount}%)`}
              value={formatCurrency(calculateDiscount(subtotal, invoice.discount), invoice.currency)}
            />
            <TotalsRow
              label={`Tax (${invoice.taxRate}%)`}
              value={formatCurrency(calculateTaxAmount(subtotal, invoice.taxRate), invoice.currency)}
            />
            <TotalsRow
              final
              label="Total"
              value={formatCurrency(
                calculateTotalAmount(invoice.items, invoice.taxRate, invoice.discount),
                invoice.currency,
              )}
            />
          </View>
        </View>

        {/* ---- Notes ---- */}
        {invoice.notes && (
          <View style={s.notesWrapper}>
            <Text style={s.sectionLabel}>Notes</Text>
            <Text style={s.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* ---- Signatures ---- */}
        <View style={s.signaturesWrapper}>
          <Text style={s.sectionLabel}>Signatures</Text>
          <View style={s.signaturesGrid}>
            {/* Business signature */}
            <View style={s.signatureBlock}>
              {signature && <Image style={s.signatureImage} src={signature} />}
              <Text style={s.signatureLine}>{bussinessname}</Text>
            </View>

            {/* Client signature placeholder */}
            <View style={s.signatureBlock}>
              {/* Empty space matching the image height so the line stays level */}
              <View style={{ height: 48 }} />
              <Text style={s.signatureLine}>{client?.name}</Text>
            </View>
          </View>

          <Text style={s.footer}>Thank you for your business! | Generated by {APP_NAME}</Text>
        </View>
      </Page>
    </Document>
  );
}
