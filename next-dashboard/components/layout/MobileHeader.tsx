'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, BarChart2, LayoutDashboard, FilePenLine, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface MobileHeaderProps {
  onPublish: () => void;
}

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Dashboard Input', href: '/dashboard-input', icon: FilePenLine },
];

export default function MobileHeader({ onPublish }: MobileHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
      {/* Hamburger + Title */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" aria-label="Open menu">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="px-5 py-5 border-b border-gray-100 bg-[#0f172a]">
              <SheetTitle className="flex items-center gap-2.5 text-white">
                <BarChart2 className="h-5 w-5 text-blue-400" />
                <span>Dashboard</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <span className="text-base font-semibold text-gray-900">Dashboard</span>
      </div>

      {/* Publish button (compact) */}
      <button
        onClick={onPublish}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Publish
      </button>
    </header>
  );
}
