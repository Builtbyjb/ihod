import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { APP_NAME } from "@/lib/constant";

const footerLinks = {
  Product: [
    // { name: "Features", href: "#" },
    { name: "Pricing", href: "/pricing" },
    // { name: "Templates", href: "#" },
    // { name: "Integrations", href: "#" },
    // { name: "API", href: "#" },
  ],
  // Resources: [
  //   { name: "Documentation", href: "#" },
  //   { name: "Blog", href: "#" },
  //   { name: "Guides", href: "#" },
  //   { name: "Help Center", href: "#" },
  //   { name: "Status", href: "#" },
  // ],
  // Company: [
  //   { name: "About", href: "#" },
  //   { name: "Careers", href: "#" },
  //   { name: "Press", href: "#" },
  //   { name: "Contact", href: "#" },
  //   { name: "Partners", href: "#" },
  // ],
  Legal: [
    { name: "Privacy", href: "/privacy-policy" },
    { name: "Terms", href: "/terms-of-service" },
    { name: "Security", href: "/security" },
    { name: "Cookies", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The simplest way to create professional invoices and get paid
              faster.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 IHOD. All rights reserved.
          </p>
          {/*<div className="flex items-center gap-6">
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </Link>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </Link>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </div>*/}
        </div>
      </div>
    </footer>
  );
}
