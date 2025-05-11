import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Settings,
  HelpCircle,
  FileText,
  Network,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const defaultNavItems: NavItem[] = [
  { icon: <Home size={18} />, label: "Home", href: "/" },
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: <FileText size={18} />,
    label: "Content Creation",
    href: "/content-creation",
  },
  {
    icon: <Network size={18} />,
    label: "Network Analysis",
    href: "/network-analysis",
  },
];

const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={18} />, label: "Settings" },
  { icon: <HelpCircle size={18} />, label: "Help" },
];

const Sidebar = ({
  items = defaultNavItems,
  activeItem = "Dashboard",
  onItemClick,
}: SidebarProps) => {
  const navigate = useNavigate();

  const handleItemClick = (label: string) => {
    if (onItemClick) {
      onItemClick(label);
      return;
    }

    const item =
      items.find((item) => item.label === label) ||
      defaultNavItems.find((item) => item.label === label);

    if (item?.href) {
      console.log(`Navigating to: ${item.href} for label: ${label}`);
      // Use React Router navigation to ensure proper client-side routing
      navigate(item.href);
    } else {
      console.log(`No href found for label: ${label}`);
    }
  };
  return (
    <div className="w-[240px] h-full border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-1">Projects</h2>
        <p className="text-sm text-gray-500">Manage your projects and tasks</p>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {items.map((item) => (
            <Button
              key={item.label}
              variant={item.label === activeItem ? "secondary" : "ghost"}
              className="w-full justify-start gap-2 text-sm h-10"
              onClick={() => handleItemClick(item.label)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 mt-auto border-t border-gray-200">
        {defaultBottomItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-2 text-sm h-10 mb-1"
            onClick={() => handleItemClick(item.label)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
