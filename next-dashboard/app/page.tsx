'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter } from 'lucide-react';
import { useDashboardData } from '@/lib/storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MobileHeader from '@/components/layout/MobileHeader';
import LevelsBoard from '@/components/dashboard/LevelsBoard';
import SwingOptionsSection from '@/components/dashboard/SwingOptionsSection';
import EarningsSection from '@/components/dashboard/EarningsSection';
import StockTrendsSection from '@/components/dashboard/StockTrendsSection';
import OpportunitiesSection from '@/components/dashboard/OpportunitiesSection';
import PublishDashboardModal from '@/components/dashboard/PublishDashboardModal';

type SectionFilter = 'all' | 'levels' | 'swingOptions' | 'earnings' | 'trends' | 'opportunities';

/**
 * Main Dashboard page.
 * Displays all 5 data sections with search/filter, publish, and CRUD operations.
 */
export default function DashboardPage() {
  const [data, setData] = useDashboardData();
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>('all');
  const [publishOpen, setPublishOpen] = useState(false);

  // Show section if filter is 'all' or matches
  const show = (s: SectionFilter) => sectionFilter === 'all' || sectionFilter === s;

  return (
    <>
      {/* Mobile header (hamburger + publish button) */}
      <MobileHeader onPublish={() => setPublishOpen(true)} />

      {/* Desktop top bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setPublishOpen(true)}
            className="gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Publish Dashboard
          </Button>
          <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors" aria-label="More options">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="px-4 lg:px-6 py-3 bg-white border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <Select value={sectionFilter} onValueChange={(v) => setSectionFilter(v as SectionFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value="levels">Levels Board</SelectItem>
              <SelectItem value="swingOptions">Swing Options</SelectItem>
              <SelectItem value="earnings">Earnings</SelectItem>
              <SelectItem value="trends">Stock Trends</SelectItem>
              <SelectItem value="opportunities">Opportunities</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.publishedAt && (
          <span className="text-xs text-gray-400 ml-auto hidden lg:block">
            Last published: {data.publishedAt}
          </span>
        )}
      </div>

      {/* Dashboard content */}
      <div className="p-4 lg:p-6 space-y-5">
        {/* 2-column grid for sections 1–4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {show('levels') && (
            <div className="lg:col-span-2">
              <LevelsBoard
                levels={data.levels}
                onUpdate={(levels) => setData((d) => ({ ...d, levels }))}
                searchFilter={search}
              />
            </div>
          )}

          {show('swingOptions') && (
            <SwingOptionsSection
              swingOptions={data.swingOptions}
              onUpdate={(swingOptions) => setData((d) => ({ ...d, swingOptions }))}
              searchFilter={search}
            />
          )}

          {show('earnings') && (
            <EarningsSection
              earnings={data.earnings}
              onUpdate={(earnings) => setData((d) => ({ ...d, earnings }))}
              searchFilter={search}
            />
          )}

          {show('trends') && (
            <StockTrendsSection
              trends={data.trends}
              onUpdate={(trends) => setData((d) => ({ ...d, trends }))}
              searchFilter={search}
            />
          )}
        </div>

        {/* Section 5: Opportunities — full width */}
        {show('opportunities') && (
          <OpportunitiesSection
            opportunities={data.opportunities}
            onUpdate={(opportunities) => setData((d) => ({ ...d, opportunities }))}
            searchFilter={search}
          />
        )}
      </div>

      {/* Publish Modal */}
      <PublishDashboardModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        data={data}
        onPublish={(publishedAt) => setData((d) => ({ ...d, publishedAt }))}
      />
    </>
  );
}
