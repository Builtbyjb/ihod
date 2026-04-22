import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Client } from "@/lib/types";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useEffect } from "react";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  addClient: (client: Client) => void;
  editClient: (client: Client) => void;
}

const clientFormSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
})

type ClientFormType = z.infer<typeof clientFormSchema>;

const API_URL = import.meta.env.VITE_API_URL;
export default function ClientForm({ open, onOpenChange, client, addClient, editClient }: ClientFormProps) {

  const handleClientCreate = async (value: ClientFormType) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/clients/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value)
      })

      if (!response.ok) throw new Error("Failed to add client")

      const newValue = { ...value, createdAt: new Date().toString() }
      addClient(newValue as Client)
      onOpenChange(false)
      toast.success("Client data added")
    } catch (error) {
      console.log(error)
      toast.error("Failed to add client")
    }
  }

  const handleClientUpdate = async (id: number, value: ClientFormType) => {
    try {
      if (!client) throw new Error("Cannot edit null client object")

      const response = await fetch(`${API_URL}/api/v1/clients/edit/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value)
      })

      if (!response.ok) throw new Error("Failed to edit client")

      const newValue: Client = {
        ...value,
        id: client.id,
        createdAt: client.createdAt,
        organizationId: client.organizationId
      }

      editClient(newValue)
      onOpenChange(false)
      toast.success("Client data updated")
    } catch (error) {
      console.log(error)
      toast.error("Failed to edit client")
    }
  }

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
    },
    validators: {
      onSubmit: clientFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (client) await handleClientUpdate(client.id, value)
      else await handleClientCreate(value)
    }
  })

  useEffect(() => {
    /* Set default values for client update  */
    if (client) {
      form.setFieldValue("name", client.name);
      form.setFieldValue("email", client.email);
      form.setFieldValue("phone", client.phone);
      form.setFieldValue("address", client.address);
      form.setFieldValue("city", client.city);
      form.setFieldValue("country", client.country);
    }
  }, [client, form])

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        form.reset()
      }
      onOpenChange(open)
    }
    }>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>
            {client
              ? "Update client information"
              : "Add a new client to your list"}
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-client-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Name */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="client-name-input">
                    Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    required
                    id="client-name-input"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    placeholder="Client's full name"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          />
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="client-email-input">Email</FieldLabel>
                  <Input
                    id="client-email-input"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    placeholder="Client's email"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          />
          <form.Field
            name="phone"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="client-phone-input">Phone</FieldLabel>
                  <Input
                    type="tel"
                    id="client-phone-input"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    placeholder="+1 (555) 123-4567"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          />
          {/* Address */}
          <form.Field
            name="address"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="client-address-input">Address</FieldLabel>
                  <Input
                    id="client-address-input"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    placeholder="Street address"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          />
          <Field orientation="horizontal" >
            {/* City */}
            <form.Field
              name="city"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="client-city-input">City</FieldLabel>
                    <Input
                      id="client-city-input"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      placeholder="City, State ZIP"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="country"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="client-country-input">Country</FieldLabel>
                    <Input
                      id="client-country-input"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      placeholder="Country"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </Field>
          <DialogFooter className="bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" id="create-client-form">{client ? "Update" : "Add"} Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
