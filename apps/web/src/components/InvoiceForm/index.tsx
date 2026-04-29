import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { Plus, Trash2, ChevronDownIcon, Mail, Phone } from "lucide-react";
import type { Client, Invoice, InvoiceStatus } from "@/lib/types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldLabel, FieldError, FieldContent, FieldTitle } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { calculateTotalAmount, calculateTaxAmount, formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { CURRENCIES } from "@/lib/store";

const API_URL = import.meta.env.VITE_API_URL;

const invoiceFormSchema = z.object({
  issueDate: z.date(),
  dueDate: z.date(),
  taxRate: z.number().min(0).max(100),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
    }),
  ),
  currency: z.string().min(2),
  notes: z.string(),
});

interface InvoiceFormProps {
  clientInfo: Client | null;
  existingInvoice?: Invoice | null;
  invoiceId?: string;
}

type InvoiceForm = z.infer<typeof invoiceFormSchema>;

const status = [
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
];

export default function InvoiceForm({ clientInfo, existingInvoice, invoiceId }: InvoiceFormProps) {
  const handleCreate = async (value: InvoiceForm) => {
    try {
      if (!clientInfo) throw new Error("Client Id not found");

      const payload = { ...value, clientId: clientInfo.id };

      const response = await fetch(`${API_URL}/api/v1/clients/${clientInfo.id}/invoices/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create invoice");

      toast.success("Invoice created");
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create invoice: " + error.message);
    }
  };

  const handleUpdate = async (value: InvoiceForm) => {
    try {
      if (!clientInfo) throw new Error("Client Id not found");
      if (!invoiceId) throw new Error("Invoice Id not found");

      const payload = { ...value, clientId: clientInfo.id };

      const response = await fetch(`${API_URL}/api/v1/clients/${clientInfo.id}/invoices/${invoiceId}/edit`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create invoice");

      toast.success("Invoice Edited");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create invoice: " + error.message);
    }
  };

  const form = useForm({
    defaultValues: {
      issueDate: new Date(),
      dueDate: new Date(),
      taxRate: 0,
      status: "draft" as InvoiceStatus,
      items: [
        {
          description: "",
          quantity: 0,
          unitPrice: 0,
        },
      ],
      currency: "",
      notes: "",
    },
    validators: {
      onSubmit: invoiceFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!existingInvoice) await handleCreate(value);
      else await handleUpdate(value);
    },
  });

  useEffect(() => {
    /* Set default values for invoice update  */
    if (existingInvoice) {
      form.setFieldValue("issueDate", new Date(existingInvoice.issueDate));
      form.setFieldValue("dueDate", new Date(existingInvoice.dueDate));
      form.setFieldValue("status", existingInvoice.status);
      form.setFieldValue("items", existingInvoice.items);
      form.setFieldValue("taxRate", existingInvoice.taxRate);
      form.setFieldValue("items", existingInvoice.items);
      form.setFieldValue("notes", existingInvoice.notes);
      form.setFieldValue("currency", existingInvoice.currency);
    }
  }, [existingInvoice, form]);

  return (
    <form
      id="create-invoice-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice details card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Select client */}
            <Field>
              <FieldContent>
                <div className="flex gap-4">
                  <h1 className="text-lg mb-2">{clientInfo?.name}</h1>
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm mt-0.5 whitespace-pre-line">{clientInfo?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm mt-0.5 whitespace-pre-line">{clientInfo?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FieldContent>
            </Field>
            <div className="flex gap-4">
              <form.Field
                name="status"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="invoice-status-select">Invoice Status</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(e) => {
                          if (e) field.handleChange(e);
                        }}
                        required
                      >
                        <SelectTrigger id="status-select" aria-invalid={isInvalid}>
                          <SelectValue placeholder="Select Status">
                            {status.find((c) => c.value === field.state.value)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {status.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="currency"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="currency-input">
                        Currency <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select
                        required
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(e) => {
                          if (e) field.handleChange(e);
                        }}
                      >
                        <SelectTrigger id="select-currency" aria-invalid={isInvalid} className="min-w-30">
                          <SelectValue>
                            {CURRENCIES.find((c) => c.value === field.state.value)?.name || "Select currency"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency.name} value={currency.value}>
                              {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Issue Date */}
              <form.Field
                name="issueDate"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="issue-date-input">Issue Date</FieldLabel>
                      <Popover>
                        <PopoverTrigger
                          id="issue-date-input"
                          className="flex border border-border items-center px-2 py-1 w-44 rounded-lg m-0 justify-between data-[empty=true]:text-muted-foreground"
                        >
                          {format(field.state.value, "PPP")}
                          <ChevronDownIcon />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.state.value}
                            onSelect={(e) => {
                              if (e) field.handleChange(e);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              {/* Due date */}
              <form.Field
                name="dueDate"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="issue-date-input">Due Date</FieldLabel>
                      <Popover>
                        <PopoverTrigger
                          id="issue-date-input"
                          className="flex border border-border rounded-lg px-2 py-1 w-44 m-0 justify-between data-[empty=true]:text-muted-foreground"
                        >
                          {format(field.state.value, "PPP")}
                          <ChevronDownIcon />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.state.value}
                            onSelect={(e) => {
                              if (e) field.handleChange(e);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary card */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Subscribe
              selector={(s) => {
                const subtotal = s.values.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
                return subtotal;
              }}
              children={(subtotal) => {
                return (
                  <div className="flex justify-between pt-4 border-t border-border">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                );
              }}
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tax</span>
                {/* Tax Rate */}
                <form.Field
                  name="taxRate"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="w-16">
                        <Input
                          id="tax-rate-input"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          className="w-16 h-8 text-center"
                          min="0"
                          max="100"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
                <span className="text-muted-foreground">%</span>
              </div>
              {/* Tax amount */}
              <div>
                <form.Subscribe
                  selector={(s) => calculateTaxAmount(s.values.items, s.values.taxRate)}
                  children={(taxAmount) => {
                    return (
                      <Field>
                        <FieldContent>
                          <span>{formatCurrency(taxAmount)}</span>
                        </FieldContent>
                      </Field>
                    );
                  }}
                />
              </div>
            </div>
            {/* Total amount to pay */}
            <form.Subscribe
              selector={(s) => calculateTotalAmount(s.values.items, s.values.taxRate)}
              children={(total) => {
                return (
                  <div className="flex justify-between pt-4 border-t border-border">
                    <div>
                      <FieldLabel>Total</FieldLabel>
                    </div>
                    <div>
                      <FieldContent>
                        <span className="font-medium">{formatCurrency(total)}</span>
                      </FieldContent>
                    </div>
                  </div>
                );
              }}
            />
          </CardContent>
        </Card>
      </div>
      {/* Line Items */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <form.Field name="items" mode="array">
              {(field) => (
                <>
                  <div className="">
                    <FieldTitle className="text-lg mb-4">Line Items</FieldTitle>
                    {field.state.value.map((_, idx) => (
                      <>
                        {field.state.value.length > 1 && <Separator key={`s-${idx}`} className="mt-6 mb-6" />}
                        <Field key={idx} orientation="responsive" className="grid md:grid-cols-12 gap-4">
                          <form.Field
                            name={`items[${idx}].description`}
                            children={(field) => {
                              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                              return (
                                <Field data-invalid={isInvalid} className="col-span-5">
                                  <FieldLabel htmlFor={`line-item-description-${idx}`}>Description</FieldLabel>
                                  <Input
                                    className="w-auto"
                                    required
                                    id={`line-item-description-${idx}`}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="Item description"
                                    autoComplete="off"
                                  />
                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                              );
                            }}
                          />
                          <form.Field
                            name={`items[${idx}].quantity`}
                            children={(field) => {
                              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                              return (
                                <Field data-invalid={isInvalid} className="col-span-2">
                                  <FieldLabel htmlFor={`line-item-quantity-${idx}`}>Quantity</FieldLabel>
                                  <Input
                                    className="w-auto"
                                    required
                                    id={`line-item-quantity-${idx}`}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                    aria-invalid={isInvalid}
                                  />
                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                              );
                            }}
                          />
                          <form.Field
                            name={`items[${idx}].unitPrice`}
                            children={(field) => {
                              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                              return (
                                <Field data-invalid={isInvalid} className="col-span-2">
                                  <FieldLabel htmlFor={`line-item-unit-price-${idx}`}>Unit Price</FieldLabel>
                                  <Input
                                    className="w-auto"
                                    required
                                    id={`line-item-unit-price-${idx}`}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                    aria-invalid={isInvalid}
                                  />
                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                              );
                            }}
                          />
                          <form.Subscribe
                            selector={(s) => {
                              const item = s.values.items[idx];
                              if (item && item.quantity && item.unitPrice) return item.quantity * item.unitPrice;
                              else return 0;
                            }}
                            children={(total) => {
                              return (
                                <Field className="col-span-2">
                                  <FieldLabel>Total</FieldLabel>
                                  <FieldContent>
                                    <span className="font-medium">{formatCurrency(total)}</span>
                                  </FieldContent>
                                </Field>
                              );
                            }}
                          />
                          <Field className="col-span-1">
                            <FieldContent>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => field.removeValue(idx)}
                                disabled={field.state.value.length === 1}
                                className="h-9 w-9"
                              >
                                <Trash2 className="h-4 w-4 " />
                              </Button>
                            </FieldContent>
                          </Field>
                        </Field>
                      </>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-8"
                      onClick={() => field.pushValue({ description: "", quantity: 0, unitPrice: 0 })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </>
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>

      {/* Notes card */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <form.Field
            name="notes"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Textarea
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Additional notes or payment instructions..."
                    aria-invalid={isInvalid}
                    rows={4}
                  />
                </Field>
              );
            }}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="create-invoice-form">
          {existingInvoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
