import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import InvoiceForm from "@/components/InvoiceForm";
import type { Client } from "@/lib/types"

const API_URL = import.meta.env.VITE_API_URL
function RouteComponent() {
  const [clientInfo, setClientInfo] = useState<Client | null>(null)
  const { clientId } = Route.useParams();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/clients/${clientId}`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Failed to get client information")
        const result = await response.json()
        // TODO: Zod validate
        setClientInfo(result.clientInfo)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [clientId])

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Create Invoice" />
      <main className="flex-1 p-4 md:p-6">
        <InvoiceForm clientInfo={clientInfo} />
      </main>
    </div>
  );
}

export const Route = createFileRoute('/_authenticated/clients/$clientId/invoices/new/')({
  component: RouteComponent,
})
