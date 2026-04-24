import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Client, Invoice } from "@/lib/types";
import { format } from "date-fns";
import { calculateSubTotal, calculateTaxAmount, calculateTotalAmount } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
  },
  invoiceInfo: {
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    padding: 8,
  },
  col1: { width: "50%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "17.5%", textAlign: "right" },
  col4: { width: "17.5%", textAlign: "right" },
  totals: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    color: "#666",
  },
  grandTotal: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: "#000",
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  notes: {
    marginTop: 40,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  notesTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#666",
    fontSize: 9,
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  client: Client
}

export default function InvoicePDF({ invoice, client }: InvoicePDFProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>IHOD</Text>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNumber}>{invoice.id}</Text>
            <Text>
              Issue Date: {format(new Date(invoice.issueDate), "MMM d, yyyy")}
            </Text>
            <Text>
              Due Date: {format(new Date(invoice.dueDate), "MMM d, yyyy")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text>{client.email}</Text>
          {client.phone && <Text>{client.phone}</Text>}
          {client.address && <Text>{client.address}</Text>}
          <Text>
            {client.city}, {client.country}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Description</Text>
            <Text style={styles.col2}>Qty</Text>
            <Text style={styles.col3}>Unit Price</Text>
            <Text style={styles.col4}>Total</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.col4}>{formatCurrency(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text>{formatCurrency(calculateSubTotal(invoice.items))}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
            <Text>{formatCurrency(calculateTaxAmount(invoice.items, invoice.taxRate))}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(calculateTotalAmount(invoice.items, invoice.taxRate))}
            </Text>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Thank you for your business! | Generated by IHOD
        </Text>
      </Page>
    </Document>
  );
}
