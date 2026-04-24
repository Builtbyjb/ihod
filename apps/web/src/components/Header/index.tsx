import { MobileNav } from "./mobile-nav";
// import { Button } from "@/components/ui/button";
// import { Bell, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <MobileNav />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {/*<div className="hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-64 pl-9" />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>*/}
      </div>
    </header>
  );
}
