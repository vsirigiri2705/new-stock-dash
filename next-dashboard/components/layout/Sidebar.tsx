'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, LayoutDashboard, FilePenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

// Navigation items for the sidebar
const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Dashboard Input',
    href: '/dashboard-input',
    icon: FilePenLine,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#0f172a] text-white shrink-0">
      {/* Brand / Title */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <BarChart2 className="h-6 w-6 text-blue-400" />
        <span className="text-base font-semibold tracking-tight">Dashboard</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
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
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs text-slate-500">Trading Dashboard v1.0</p>
      </div>
    </aside>
  );
}
