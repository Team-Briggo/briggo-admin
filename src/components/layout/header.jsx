"use client";

import { useSidebarStore } from "@/stores";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ title }) {
  const { isCollapsed, toggleMobile } = useSidebarStore();

  return (
    <header
      className={cn(
        "flex sticky top-0 z-30 gap-4 items-center px-6 h-16 border-b transition-all duration-300 bg-background",
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMobile}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Page title */}
      {title && <h1 className="text-lg font-semibold">{title}</h1>}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <ThemeToggle />
    </header>
  );
}
