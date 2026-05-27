import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import InvoiceForm from "@/components/InvoiceForm";
import type { Client } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientSchema } from "@shared/lib/zod-schema";
import { useFetch } from "@/hooks/useFetch";

const API_URL = import.meta.env.VITE_API_URL;
function RouteComponent() {
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const { clientId } = Route.useParams();
  const router = useRouter();
  const { doGET } = useFetch();

  useEffect(() => {
    (async () => {
      try {
        const response = await doGET(`${API_URL}/api/v1/clients/${clientId}`);
        if (response instanceof Error) throw response;

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        const parsedClient = ClientSchema.parse(result.clientInfo);
        setClientInfo(parsedClient);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [clientId, doGET]);

  return (
    <main className="mb-8">
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
