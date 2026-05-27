import { Button } from "@/components/ui/button";
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
import { Field } from "@/components/ui/field";
import { useEffect } from "react";
import { ClientSchema, ClientFormSchema } from "@shared/lib/zod-schema";
import { useFetch } from "@/hooks/useFetch";
import TextInputField from "../Form/TextInputField";

type ClientFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  addClient: (client: Client) => void;
  editClient: (client: Client) => void;
};

type ClientFormType = z.infer<typeof ClientFormSchema>;

export default function ClientForm({ open, onOpenChange, client, addClient, editClient }: ClientFormProps) {
  const { doPOST, doPUT } = useFetch();

  const handleClientCreate = async (value: ClientFormType) => {
    try {
      const response = await doPOST("/api/v1/clients/create", value);
      if (response instanceof Error) throw response;

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      const parsedClient = ClientSchema.parse(result.client);

      addClient(parsedClient);
      onOpenChange(false);
      toast.success("Client data added");
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      console.log(error);
    }
  };

  const handleClientUpdate = async (id: string, value: ClientFormType) => {
    try {
      if (!client) throw new Error("Client not found");

      const response = await doPUT(`/api/v1/clients/edit/${id}`, value);
      if (response instanceof Error) throw response;

      const newValue: Client = {
        ...value,
        id: client.id,
        createdAt: client.createdAt,
        organizationId: client.organizationId,
      };

      editClient(newValue);
      onOpenChange(false);
      toast.success("Client data updated");
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      console.log(error);
    }
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
    } as ClientFormType,
    validators: {
      onSubmit: ClientFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (client) await handleClientUpdate(client.id, value);
      else await handleClientCreate(value);
    },
  });

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
  }, [client, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>
            {client ? "Update client information" : "Add a new client to your list"}
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
              return <TextInputField field={field} id="name" label="Name" placeholder="Client's full name" />;
            }}
          />
          <form.Field
            name="email"
            children={(field) => {
              return (
                <TextInputField
                  field={field}
                  id="email"
                  label="Email"
                  placeholder="Client's email"
                  isRequired={false}
                />
              );
            }}
          />
          <form.Field
            name="phone"
            children={(field) => {
              return (
                <TextInputField
                  field={field}
                  id="phone"
                  label="Phone"
                  placeholder="+234 070 124 4567"
                  isRequired={false}
                />
              );
            }}
          />
          {/* Address */}
          <form.Field
            name="address"
            children={(field) => {
              return (
                <TextInputField
                  field={field}
                  id="address"
                  label="Address"
                  placeholder="Street address"
                  isRequired={false}
                />
              );
            }}
          />
          <Field orientation="horizontal">
            {/* City */}
            <form.Field
              name="city"
              children={(field) => {
                return (
                  <TextInputField
                    field={field}
                    id="city"
                    label="City"
                    placeholder="City, State ZIP"
                    isRequired={false}
                  />
                );
              }}
            />
            <form.Field
              name="country"
              children={(field) => {
                return (
                  <TextInputField field={field} id="country" label="Country" placeholder="Country" isRequired={false} />
                );
              }}
            />
          </Field>
          <DialogFooter className="bg-background border-t-0">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" id="create-client-form">
              {client ? "Update" : "Add"} Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
