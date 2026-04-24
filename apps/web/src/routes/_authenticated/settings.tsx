import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Settings" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              This information will appear on your invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your Business Name"
                  defaultValue="Invoicely"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@business.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://yourwebsite.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Business Street, City, State ZIP, Country"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Defaults</CardTitle>
            <CardDescription>Default settings for new invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  placeholder="10"
                  defaultValue="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
                <Input
                  id="paymentTerms"
                  type="number"
                  placeholder="30"
                  defaultValue="30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultNotes">Default Invoice Notes</Label>
              <Textarea
                id="defaultNotes"
                placeholder="Thank you for your business!"
                rows={3}
                defaultValue="Thank you for your business! Payment is due within the specified terms."
              />
            </div>
          </CardContent>
        </Card>

        {/*<Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your application data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your data is stored locally in your browser. Clearing your browser
              data will remove all invoices and clients.
            </p>
            <Separator />
            <div className="flex gap-4">
              <Button variant="outline">Export Data</Button>
              <Button variant="destructive">Clear All Data</Button>
            </div>
          </CardContent>
        </Card>*/}

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/settings")({
  component: RouteComponent,
});
