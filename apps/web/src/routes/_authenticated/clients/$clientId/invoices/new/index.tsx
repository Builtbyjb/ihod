import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import InvoiceForm from "@/components/InvoiceForm";
import type { Client } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
function RouteComponent() {
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const { clientId } = Route.useParams();
  const router = useRouter();

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
      <Button variant="ghost" onClick={() => router.history.back()} className="w-fit mb-4">
        <ArrowLeft className="mr-2 h-8 w-8" />
        Back
      </Button>
      <InvoiceForm clientInfo={clientInfo} />
    </main>
  );
}

export const Route = createFileRoute("/_authenticated/clients/$clientId/invoices/new/")({
  component: RouteComponent,
});
