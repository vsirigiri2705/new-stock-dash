'use client';

import React from 'react';
import { FilePenLine } from 'lucide-react';
import DashboardInputForm from '@/components/forms/DashboardInputForm';
import MobileHeader from '@/components/layout/MobileHeader';

/**
 * Dashboard Input page — form for adding new entries to each section.
 */
export default function DashboardInputPage() {
  return (
    <>
      {/* Mobile header */}
      <MobileHeader onPublish={() => {}} />

      {/* Desktop top bar */}
      <div className="hidden lg:flex items-center px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <FilePenLine className="h-5 w-5 text-blue-500" />
          <h1 className="text-lg font-semibold text-gray-900">Dashboard Input</h1>
        </div>
        <p className="ml-4 text-sm text-gray-400">Add new entries to any dashboard section</p>
      </div>

      <div className="p-4 lg:p-6">
        <DashboardInputForm />
      </div>
    </>
  );
}
