import { StyleSheet } from "@react-pdf/renderer";

export const defaultStyles = StyleSheet.create({
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
