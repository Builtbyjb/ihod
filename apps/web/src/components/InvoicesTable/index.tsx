import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import type { Invoice } from "@shared/lib/types";
import { format } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { calculateTotalAmount, formatCurrency, getStatusVariant } from "@/lib/utils";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";

interface InvoicesTableProps {
  clientId: string;
  invoices: Invoice[];
  onDelete: (id: string) => void;
}

export default function InvoicesTable({ invoices, onDelete, clientId }: InvoicesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { doDELETE } = useFetch();

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const response = await doDELETE(`/api/v1/clients/${clientId}/invoices/${deleteId}/delete`);
        if (response instanceof Error) throw response;

        if (!response.ok) throw new Error("An error occurred while deleting the invoice");

        onDelete(deleteId);
        toast.success("Invoice Deleted");
      } catch (error: unknown) {
        if (error instanceof Error) toast.error(error.message);
        console.log(error);
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleNavigate = (clientId: string, invoiceId: string) => {
    navigate({ to: `/clients/${clientId}/invoices/${invoiceId}` });
  };

  return (
    <>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices && (
              <>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No invoices found. Create your first invoice to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="cursor-pointer" onClick={() => handleNavigate(clientId, invoice.id)}>
                        <div className="flex flex-col">
                          <span className="font-medium">{invoice.invoiceNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="hidden md:table-cell text-sm cursor-pointer"
                        onClick={() => handleNavigate(clientId, invoice.id)}
                      >
                        {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell
                        className="hidden lg:table-cell text-sm cursor-pointer"
                        onClick={() => handleNavigate(clientId, invoice.id)}
                      >
                        {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell
                        className="font-semibold cursor-pointer"
                        onClick={() => handleNavigate(clientId, invoice.id)}
                      >
                        {formatCurrency(
                          calculateTotalAmount(invoice.items, invoice.taxRate, invoice.discount),
                          invoice.currency,
                        )}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => handleNavigate(clientId, invoice.id)}>
                        <Badge className={`capitalize ${getStatusVariant(invoice.status)}`}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate({
                                  to: "/clients/$clientId/invoices/$invoiceId",
                                  params: { invoiceId: invoice.id.toString(), clientId },
                                })
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate({
                                  to: "/clients/$clientId/invoices/$invoiceId/edit",
                                  params: { invoiceId: invoice.id.toString(), clientId },
                                })
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(invoice.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
