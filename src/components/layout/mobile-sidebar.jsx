'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Users,
  Instagram,
  CreditCard,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const menuItems = [
  {
    title: 'Creators',
    href: '/creators',
    icon: Users,
  },
  {
    title: 'Instagram Automations',
    href: '/instagram-automations',
    icon: Instagram,
  },
  {
    title: 'Credits',
    href: '/credits',
    icon: CreditCard,
  },
];

export function MobileSidebar() {
  const pathname = usePathname();
  const { isMobileOpen, closeMobile } = useSidebarStore();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    closeMobile();
    logout();
  };

  return (
    <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="flex h-16 items-center border-b px-4">
          <SheetTitle className="text-xl font-bold">Briggo Admin</SheetTitle>
        </SheetHeader>

        <div className="flex h-[calc(100vh-4rem)] flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t p-2">
            {user && (
              <div className="mb-2 px-3 py-2">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
