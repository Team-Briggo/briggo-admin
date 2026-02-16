'use client';

import { useSidebarStore } from '@/stores';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header({ title }) {
  const { isCollapsed, toggleMobile } = useSidebarStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 transition-all duration-300',
        isCollapsed ? 'md:ml-16' : 'md:ml-64'
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMobile}
      >
        <Menu className="h-5 w-5" />
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
