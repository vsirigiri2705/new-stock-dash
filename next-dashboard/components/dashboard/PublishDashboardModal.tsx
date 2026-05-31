'use client';

import React from 'react';
import { DashboardData } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/lib/utils';
import { toast } from 'sonner';

interface PublishDashboardModalProps {
  open: boolean;
  onClose: () => void;
  data: DashboardData;
  onPublish: (publishedAt: string) => void;
}

/**
 * Shows a summary of all dashboard data before confirming a publish/snapshot.
 */
export default function PublishDashboardModal({
  open,
  onClose,
  data,
  onPublish,
}: PublishDashboardModalProps) {
  function handleConfirm() {
    const ts = formatTimestamp();
    onPublish(ts);
    toast.success('Dashboard published successfully.');
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish Dashboard</DialogTitle>
          <DialogDescription>
            Review your data snapshot below. Click Confirm Publish to save with a timestamp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm py-2">
          {/* Levels */}
          <Section title="Levels Board" count={data.levels.length}>
            {data.levels.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                <span className="font-semibold text-blue-600">{r.ticker}</span>
                <span className="text-gray-500 text-xs">Call: <span className="text-green-500">{r.callWall}</span> | Put: <span className="text-red-500">{r.putWall}</span></span>
              </div>
            ))}
          </Section>

          {/* Swing Options */}
          <Section title="Swing Options" count={data.swingOptions.length}>
            {data.swingOptions.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                <span className="font-semibold text-blue-600">{r.ticker}</span>
                <span className="text-gray-500 text-xs">{r.strikePrice} · {r.expirationDate}</span>
              </div>
            ))}
          </Section>

          {/* Earnings */}
          <Section title="Earnings" count={data.earnings.length}>
            {data.earnings.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                <span className="font-semibold text-blue-600">{r.ticker}</span>
                <span className="text-gray-500 text-xs">{r.earningsDate}</span>
              </div>
            ))}
          </Section>

          {/* Trends */}
          <Section title="Stock Trends" count={data.trends.length}>
            {data.trends.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                <span className="font-semibold text-blue-600">{r.ticker}</span>
                <Badge
                  variant={r.trend === 'Bullish' ? 'success' : r.trend === 'Bearish' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {r.trend}
                </Badge>
              </div>
            ))}
          </Section>

          {/* Opportunities */}
          <Section title="Opportunities" count={data.opportunities.length}>
            {data.opportunities.map((r) => (
              <div key={r.id} className="py-1 border-b border-gray-50 last:border-0">
                <span className="font-semibold text-blue-600 mr-2">{r.ticker}</span>
                <span className="text-gray-500 text-xs line-clamp-1">{r.comments}</span>
              </div>
            ))}
          </Section>

          {data.publishedAt && (
            <p className="text-xs text-gray-400">Last published: {data.publishedAt}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper sub-component
function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <Badge variant="secondary" className="text-xs">{count}</Badge>
      </div>
      <div className="bg-gray-50 rounded-md px-3 py-1">
        {count === 0 ? <p className="text-xs text-gray-400 py-1">No entries</p> : children}
      </div>
    </div>
  );
}
