import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronDownIcon } from "lucide-react";
import type { Client, Invoice, InvoiceItem } from "@/lib/types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldContent,
} from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const invoiceFormSchema = z.object({
  clientId: z.number().positive(),
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
  notes: z.string(),
});

interface InvoiceFormProps {
  clients: Client[];
  existingInvoice?: Invoice | null;
}

type InvoiceForm = z.infer<typeof invoiceFormSchema>;

const status = [
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" }
]

export default function InvoiceForm({
  clients,
  existingInvoice,
}: InvoiceFormProps) {
  const navigate = useNavigate();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      clientId: 0,
      issueDate: new Date(),
      dueDate: new Date(),
      taxRate: 0,
      status: "draft",
      items: [
        {
          description: "",
          quantity: 0,
          unitPrice: 0,
        },
      ],
      notes: "",
    },
    validators: {
      onSubmit: invoiceFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      try {
        const response = await fetch(`${API_URL}/api/v1/invoice/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(value)
        })

        if (!response.ok) {
          throw new Error("Failed to create invoice")
        }

        toast.success("Invoice created")
      } catch (error) {
        console.log(error)
        toast.error("Failed to create invoice: " + error.message);

      }
    },
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    existingInvoice?.items || [
      { id: uuidv4(), description: "", quantity: 1, unitPrice: 0 },
    ],
  );

  const addItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
            <div className="flex gap-4">
              <form.Field
                name="clientId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="client-id-select">Client</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(e) => {
                          if (e) field.handleChange(e);
                        }}
                        required
                      >
                        <SelectTrigger
                          id="select-client"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue >
                            {clients.find(c => c.id === field.state.value)?.name || "Select a client"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Add a new client {" "}
                        <Button
                          onClick={() => navigate({ to: "/clients" })}
                          variant="ghost"
                          className="underline p-0 text-muted-foreground"
                        >
                          here
                        </Button>
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="status"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
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
                        <SelectTrigger
                          id="status-select"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Select Status">
                            {status.find(c => c.value === field.state.value)?.label}
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="issue-date-input">
                        Issue Date
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger id="issue-date-input"
                          className="flex border border-border items-center p-2 w-44 rounded-lg m-0 justify-between data-[empty=true]:text-muted-foreground"
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              {/* Due date */}
              <form.Field
                name="dueDate"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="issue-date-input">
                        Due Date
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger id="issue-date-input"
                          className="flex border border-border rounded-lg p-2 w-44 m-0 justify-between data-[empty=true]:text-muted-foreground"
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
                const subtotal = s.values.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                return subtotal
              }}
              children={(subtotal) => {
                return (
                  <div className="flex justify-between pt-4 border-t border-border">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                )
              }}
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tax</span>
                {/* Tax Rate */}
                <form.Field
                  name="taxRate"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="w-16">
                        <Input
                          id="tax-rate-input"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          className="w-16 h-8 text-center"
                          min="0"
                          max="100"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <span className="text-muted-foreground">%</span>
              </div>
              {/* Tax amount */}
              <div>
                <form.Subscribe
                  selector={(s) => {
                    const subtotal = s.values.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                    const taxAmount = subtotal * ((s.values.taxRate) / 100)
                    return taxAmount
                  }}
                  children={(taxAmount) => {
                    return (
                      <Field>
                        <FieldContent>
                          <span>{formatCurrency(taxAmount)}</span>
                        </FieldContent>
                      </Field>
                    )
                  }}
                />
              </div>
            </div>
            {/* Total amount to pay */}
            <form.Subscribe
              selector={(s) => {
                const subtotal = s.values.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                const taxAmount = subtotal * ((s.values.taxRate) / 100)
                return subtotal + taxAmount
              }}
              children={(total) => {
                return (
                  <div className="flex justify-between pt-4 border-t border-border">
                    <div>
                      <FieldLabel>Total</FieldLabel>
                    </div>
                    <div>
                      <FieldContent>
                        <span className="font-medium">
                          {formatCurrency(total)}
                        </span>
                      </FieldContent>
                    </div>
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
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
            <FieldGroup>
              {items.map((item, idx) => (
                <Field
                  key={idx}
                  orientation="responsive"
                  className="grid md:grid-cols-12 gap-4"
                >
                  <form.Field
                    name={`items[${idx}].description`}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="col-span-5">
                          <FieldLabel htmlFor={`line-item-description-${idx}`}>
                            Description
                          </FieldLabel>
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
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name={`items[${idx}].quantity`}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="col-span-2">
                          <FieldLabel htmlFor={`line-item-quantity-${idx}`}>
                            Quantity
                          </FieldLabel>
                          <Input
                            className="w-auto"
                            required
                            id={`line-item-quantity-${idx}`}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name={`items[${idx}].unitPrice`}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="col-span-2">
                          <FieldLabel htmlFor={`line-item-unit-price-${idx}`}>
                            Unit Price
                          </FieldLabel>
                          <Input
                            className="w-auto"
                            required
                            id={`line-item-unit-price-${idx}`}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            aria-invalid={isInvalid}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Subscribe
                    selector={(s) => {
                      const item = s.values.items[idx]
                      if (item && item.quantity && item.unitPrice) {
                        return item.quantity * item.unitPrice
                      } else {
                        return 0
                      }
                    }}
                    children={(total) => {
                      return (
                        <Field className="col-span-2">
                          <FieldLabel>Total</FieldLabel>
                          <FieldContent>
                            <span className="font-medium">
                              {formatCurrency(total)}
                            </span>
                          </FieldContent>
                        </Field>
                      )
                    }}
                  />
                  <Field className="col-span-1">
                    <FieldContent>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4 " />
                      </Button>
                    </FieldContent>
                  </Field>
                </Field>
              ))}
            </FieldGroup>
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
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
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
        <Button
          type="button"
          variant="outline"
          onClick={() => router.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" form="create-invoice-form">
          {existingInvoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
