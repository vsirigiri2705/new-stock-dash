'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** On mobile, sections are collapsible. Default collapsed = true */
  defaultCollapsed?: boolean;
}

/**
 * Wrapper card for each dashboard section.
 * On desktop: always expanded.
 * On mobile: accordion-style, toggleable.
 */
export default function DashboardCard({
  title,
  children,
  footer,
  className,
  defaultCollapsed = true,
}: DashboardCardProps) {
  const [mobileOpen, setMobileOpen] = useState(!defaultCollapsed);

  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}>
      {/* Header — clickable on mobile to toggle */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100 cursor-pointer lg:cursor-default select-none"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {/* Chevron visible only on mobile */}
        <span className="lg:hidden text-gray-400">
          {mobileOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </div>

      {/* Body — always visible on desktop, togglable on mobile */}
      <div className={cn('lg:block', mobileOpen ? 'block' : 'hidden')}>
        <div className="p-4 pt-3">{children}</div>
        {footer && (
          <div className="px-4 pb-4 pt-0 flex items-center gap-2 border-t border-gray-100 mt-2 pt-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
