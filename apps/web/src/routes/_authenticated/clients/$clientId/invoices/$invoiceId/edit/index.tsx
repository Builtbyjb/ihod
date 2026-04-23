import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import Header from "@/components/Header";
import InvoiceForm from "@/components/InvoiceForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Invoice } from "@/lib/types";

function RouteComponent() {

  // if (!invoice) {
  //   return (
  //     <div className="flex flex-col min-h-screen">
  //       <Header title="Invoice Not Found" />
  //       <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
  //         <div className="text-center">
  //           <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
  //           <p className="text-muted-foreground mb-4">
  //             The invoice you&apos;re trying to edit doesn&apos;t exist.
  //           </p>
  //           <Button onClick={() => navigate({ to: "/invoices" })}>
  //             Back to Invoices
  //           </Button>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col min-h-screen">
      {/*<Header title={`Edit ${invoice.invoiceNumber}`} />
      <main className="flex-1 p-4 md:p-6">
        <InvoiceForm
          invoiceNumber={invoice.invoiceNumber}
          onSubmit={handleSubmit}
          existingInvoice={invoice}
        />
      </main>*/}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/clients/$clientId/invoices/$invoiceId/edit/")({
  component: RouteComponent,
});
