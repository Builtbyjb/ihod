import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import ClientsTable from "@/components/ClientsTable";
import ClientForm from "@/components/ClientForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Client } from "@/lib/types";
import * as z from "zod";
import { useLayout } from "@/hooks/useLayout";

const clientsResponseSchema = z.array(
  z.object({
    id: z.string(),
    organizationId: z.number(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    createdAt: z.string(),
  }),
);

const API_URL = import.meta.env.VITE_API_URL;

function RouteComponent() {
  const { setTitle } = useLayout();
  setTitle("Clients");

  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    setEditingClient(null);
  };

  const handleClientEdit = (editedClient: Client) => {
    setClients((prev) => prev.map((client) => (client.id === editedClient.id ? editedClient : client)));
  };

  const handleClientAdd = (client: Client) => {
    setClients((prev) => [...prev, client]);
  };

  const handleClientDelete = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/clients`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch clients");

        const data = await response.json();
        const parsedClients = clientsResponseSchema.parse(data.clients);

        setClients(parsedClients);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <main className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        {/*<div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>*/}
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <ClientsTable onEdit={handleEdit} clients={clients} deleteClient={handleClientDelete} />

      <ClientForm
        open={formOpen}
        onOpenChange={handleFormClose}
        client={editingClient}
        addClient={handleClientAdd}
        editClient={handleClientEdit}
      />
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/clients/")({
  component: RouteComponent,
});
