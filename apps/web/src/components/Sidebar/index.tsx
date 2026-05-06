import * as React from "react";
import { ChevronRight, CreditCard, LayoutDashboard, LogOut, Settings, User, UserPlus, Users } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "../ui/separator";
import { Badge } from "@/components/ui/badge";

type SidebarProps = {
  businessname?: string;
  username?: string;
  email?: string;
};

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Clients",
    url: "/Clients",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    items: [
      {
        title: "Profile",
        url: "/settings",
        icon: User,
      },
      {
        title: "Billing",
        url: "/settings/billing",
        icon: CreditCard,
      },
      {
        title: "Referral",
        url: "/settings/referral",
        icon: UserPlus,
      },
    ],
  },
];

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem
            className="mt-4"
            onClick={() => {
              setOpenMobile(false);
              navigate({ to: "/dashboard" });
            }}
          >
            <div className="flex gap-2 text-sm leading-tight">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://picsum.photos/id/15/200/300" alt="user avatar" className="" />
                <AvatarFallback>{props.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="truncate font-medium text-xl">{props.businessname}</span>
                <span className="truncate text-xs">{props.username}</span>
                <span className="truncate text-xs">{props.email}</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Badge className="bg-blue-100 text-blue-700/80">Beta</Badge>
      <Separator className="mt-2 mb-2" />
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <Collapsible key={item.title} defaultOpen={item.isActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    className="hover:bg-accent flex gap-4 items-center hover:cursor-pointer w-full rounded-lg p-2"
                    onClick={() => {
                      if (item.items === undefined) {
                        navigate({ to: item.url });
                        setOpenMobile(false);
                      }
                    }}
                  >
                    {/*<SidebarMenuButton>*/}
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.items && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                    {/*</SidebarMenuButton>*/}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.items?.length ? (
                      <>
                        <SidebarMenuSub className="">
                          {item.items?.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton
                                tooltip={subItem.title}
                                className="hover:bg-accent flex gap-4 items-center hover:cursor-pointer"
                                onClick={() => {
                                  setOpenMobile(false);
                                  navigate({ to: subItem.url });
                                }}
                              >
                                <subItem.icon className="w-4 h-4" />
                                <span>{subItem.title}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenuSub>
                      </>
                    ) : null}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-destructive hover:bg-red-200 hover:text-destructive hover:cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/*Footer*/}</SidebarFooter>
    </Sidebar>
  );
}
