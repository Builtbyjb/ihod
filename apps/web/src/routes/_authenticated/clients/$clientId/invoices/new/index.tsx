import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import InvoiceForm from "@/components/InvoiceForm";
import type { Client } from "@/lib/types";

const API_URL = import.meta.env.VITE_API_URL;
function RouteComponent() {
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const { clientId } = Route.useParams();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/clients/${clientId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to get client information");
        const result = await response.json();
        // TODO: Zod validate
        setClientInfo(result.clientInfo);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [clientId]);

  return (
    <main>
      <InvoiceForm clientInfo={clientInfo} />
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/clients/$clientId/invoices/new/")({
  component: RouteComponent,
});
