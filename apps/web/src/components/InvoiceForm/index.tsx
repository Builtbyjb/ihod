import { useState, useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { Client, Invoice, InvoiceItem } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface InvoiceFormProps {
  clients: Client[];
  invoiceNumber: string;
  onSubmit: (invoice: Invoice) => void;
  existingInvoice?: Invoice | null;
}

export default function InvoiceForm({
  clients,
  invoiceNumber,
  onSubmit,
  existingInvoice,
}: InvoiceFormProps) {
  const navigate = useNavigate();
  const router = useRouter();

  const [clientId, setClientId] = useState(existingInvoice?.clientId || "");
  const [issueDate, setIssueDate] = useState(
    existingInvoice?.issueDate || new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState(existingInvoice?.dueDate || "");
  const [taxRate, setTaxRate] = useState(
    existingInvoice?.taxRate?.toString() || "10",
  );
  const [notes, setNotes] = useState(existingInvoice?.notes || "");
  const [items, setItems] = useState<InvoiceItem[]>(
    existingInvoice?.items || [
      { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ],
  );

  useEffect(() => {
    if (issueDate && !dueDate) {
      const date = new Date(issueDate);
      date.setDate(date.getDate() + 30);
      setDueDate(date.toISOString().split("T")[0]);
    }
  }, [issueDate, dueDate]);

  const addItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      }),
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (parseFloat(taxRate) / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const invoice: Invoice = {
      id: existingInvoice?.id || uuidv4(),
      invoiceNumber: existingInvoice?.invoiceNumber || invoiceNumber,
      clientId,
      client,
      items,
      subtotal,
      taxRate: parseFloat(taxRate),
      taxAmount,
      total,
      status: existingInvoice?.status || "draft",
      issueDate,
      dueDate,
      notes,
      createdAt: existingInvoice?.createdAt || new Date().toISOString(),
    };

    onSubmit(invoice);
    navigate({ to: "/invoices" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={existingInvoice?.invoiceNumber || invoiceNumber}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={clientId}
                  onValueChange={() => setClientId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tax</span>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-16 h-8 text-center"
                  min="0"
                  max="100"
                />
                <span className="text-muted-foreground">%</span>
              </div>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-border font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="grid sm:grid-cols-12 gap-4 items-start"
              >
                <div className="sm:col-span-5">
                  <Label className="sm:hidden text-muted-foreground mb-1">
                    Description
                  </Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Item description"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="sm:hidden text-muted-foreground mb-1">
                    Quantity
                  </Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "quantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    min="1"
                    className="text-center"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="sm:hidden text-muted-foreground mb-1">
                    Unit Price
                  </Label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "unitPrice",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    min="0"
                    step="0.01"
                    className="text-right"
                    required
                  />
                </div>
                <div className="sm:col-span-2 flex items-center justify-end">
                  <span className="font-medium">
                    {formatCurrency(item.total)}
                  </span>
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="h-9 w-9"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes or payment instructions..."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!clientId}>
          {existingInvoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
