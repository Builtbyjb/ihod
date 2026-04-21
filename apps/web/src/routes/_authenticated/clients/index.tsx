import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Header from "@/components/Header";
import ClientsTable from "@/components/ClientsTable";
import ClientForm from "@/components/ClientForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Client } from "@/lib/types";

function RouteComponent() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditingClient(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Clients" />
      <main className="flex-1 p-4 md:p-6 space-y-4">
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

        <ClientsTable onEdit={handleEdit} />

        <ClientForm
          open={formOpen}
          onOpenChange={handleFormClose}
          client={editingClient}
        />
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/clients/")({
  component: RouteComponent,
});
