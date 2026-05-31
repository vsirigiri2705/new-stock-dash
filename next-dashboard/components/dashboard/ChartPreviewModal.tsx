'use client';

import React from 'react';
import { Opportunity } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { tickerGradient } from '@/lib/utils';

interface ChartPreviewModalProps {
  opportunity: Opportunity | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Modal to preview the chart image attached to an Opportunity.
 */
export default function ChartPreviewModal({ opportunity, open, onClose }: ChartPreviewModalProps) {
  if (!opportunity) return null;

  const gradient = tickerGradient(opportunity.ticker);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{opportunity.ticker} — Chart Preview</DialogTitle>
          <DialogDescription>{opportunity.comments}</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {opportunity.chartImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={opportunity.chartImage}
              alt={`${opportunity.ticker} chart`}
              className="w-full object-contain max-h-96"
            />
          ) : (
            // Placeholder gradient
            <div
              className={`w-full h-64 bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <div className="text-center text-white">
                <p className="text-4xl font-bold opacity-80">{opportunity.ticker}</p>
                <p className="text-sm opacity-60 mt-2">No chart image uploaded</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
