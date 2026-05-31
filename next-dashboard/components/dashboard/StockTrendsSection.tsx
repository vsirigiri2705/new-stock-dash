'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { StockTrend } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import DashboardCard from './DashboardCard';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';

interface StockTrendsSectionProps {
  trends: StockTrend[];
  onUpdate: (t: StockTrend[]) => void;
  searchFilter: string;
}

type TrendType = 'Bullish' | 'Bearish' | 'Neutral';

const TrendIcon = ({ trend }: { trend: TrendType }) => {
  if (trend === 'Bullish') return <TrendingUp className="h-4 w-4 text-green-500 inline mr-1" />;
  if (trend === 'Bearish') return <TrendingDown className="h-4 w-4 text-red-500 inline mr-1" />;
  return <Minus className="h-4 w-4 text-gray-400 inline mr-1" />;
};

const trendClass: Record<TrendType, string> = {
  Bullish: 'text-green-600 font-semibold',
  Bearish: 'text-red-600 font-semibold',
  Neutral: 'text-gray-500',
};

const trendBadgeClass: Record<TrendType, string> = {
  Bullish: 'bg-green-50 text-green-700 border-green-200',
  Bearish: 'bg-red-50 text-red-700 border-red-200',
  Neutral: 'bg-gray-50 text-gray-600 border-gray-200',
};

const emptyTrend = (): Omit<StockTrend, 'id'> => ({ ticker: '', trend: 'Bullish', comments: '' });

export default function StockTrendsSection({ trends, onUpdate, searchFilter }: StockTrendsSectionProps) {
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing]       = useState<StockTrend | null>(null);
  const [detail, setDetail]         = useState<StockTrend | null>(null);
  const [form, setForm]             = useState(emptyTrend());

  const filtered = trends.filter((r) =>
    r.ticker.toLowerCase().includes(searchFilter.toLowerCase())
  );

  function openDetail(row: StockTrend) { setDetail(row); setDetailOpen(true); }

  function openEdit(row: StockTrend | null) {
    if (row) { setEditing(row); setForm({ ticker: row.ticker, trend: row.trend, comments: row.comments }); }
    else     { setEditing(null); setForm(emptyTrend()); }
    setEditOpen(true);
  }

  function handleSave() {
    if (!form.ticker.trim()) { toast.error('Ticker required'); return; }
    if (editing) {
      onUpdate(trends.map((r) => (r.id === editing.id ? { ...editing, ...form } : r)));
      toast.success(`Updated ${form.ticker}`);
    } else {
      onUpdate([...trends, { id: generateId(), ...form }]);
      toast.success(`Added ${form.ticker}`);
    }
    setEditOpen(false);
  }

  function handleDelete(row: StockTrend) { setEditing(row); setDeleteOpen(true); }

  function confirmDelete() {
    if (!editing) return;
    onUpdate(trends.filter((r) => r.id !== editing.id));
    toast.success(`Deleted ${editing.ticker}`);
    setDeleteOpen(false); setEditing(null);
  }

  const footer = (
    <Button size="sm" variant="outline" onClick={() => openEdit(null)} className="gap-1.5">
      <Pencil className="h-3.5 w-3.5" /> Add / Edit
    </Button>
  );

  return (
    <>
      <DashboardCard title="Stock Trends" footer={footer}>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No trends found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Ticker', 'Trend', 'Comments', ''].map((h) => (
                    <th key={h} className="text-left py-2 px-2 text-xs font-semibold uppercase text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                    {/* Clickable ticker */}
                    <td className="py-2 px-2">
                      <button
                        onClick={() => openDetail(row)}
                        className="font-semibold text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 flex items-center gap-1 transition-colors"
                      >
                        {row.ticker}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </button>
                    </td>
                    <td className={`py-2 px-2 whitespace-nowrap ${trendClass[row.trend]}`}>
                      <TrendIcon trend={row.trend} />
                      {row.trend}
                    </td>
                    {/* Clickable comment */}
                    <td className="py-2 px-2 max-w-[200px]">
                      <button
                        onClick={() => openDetail(row)}
                        className="text-gray-500 hover:text-gray-800 text-left truncate w-full block transition-colors"
                        title={row.comments}
                      >
                        {row.comments || <span className="italic text-gray-300">—</span>}
                      </button>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(row)} className="p-1 rounded hover:bg-blue-50 text-blue-500 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(row)} className="p-1 rounded hover:bg-red-50 text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      {/* ── DETAIL MODAL ─────────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <span className="text-blue-600 font-bold">{detail?.ticker}</span>
              <Badge variant="outline" className="text-xs font-normal">Stock Trend</Badge>
            </DialogTitle>
            <DialogDescription>Full details for this stock trend.</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 py-1">
              {/* Trend badge */}
              <div className={`flex items-center gap-2 rounded-md px-3 py-2.5 border ${trendBadgeClass[detail.trend]}`}>
                <TrendIcon trend={detail.trend} />
                <div>
                  <p className="text-xs font-semibold uppercase opacity-60 mb-0.5">Trend Direction</p>
                  <p className="text-sm font-bold">{detail.trend}</p>
                </div>
              </div>
              {/* Comments */}
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Comments</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3 leading-relaxed whitespace-pre-wrap">
                  {detail.comments || <span className="italic text-gray-400">No comments added.</span>}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => { setDetailOpen(false); openEdit(detail!); }}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
            <Button size="sm" onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EDIT MODAL ───────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.ticker}` : 'Add Trend'}</DialogTitle>
            <DialogDescription>Set the trend direction and notes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Ticker</Label>
              <Input value={form.ticker} onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value }))} placeholder="SPY" />
            </div>
            <div className="space-y-1.5">
              <Label>Trend</Label>
              <Select value={form.trend} onValueChange={(v) => setForm((f) => ({ ...f, trend: v as TrendType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bullish">📈 Bullish</SelectItem>
                  <SelectItem value="Bearish">📉 Bearish</SelectItem>
                  <SelectItem value="Neutral">➡️ Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Comments</Label>
              <Textarea value={form.comments} onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))} placeholder="Notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM ───────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Trend</DialogTitle>
            <DialogDescription>Delete <strong>{editing?.ticker}</strong>? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
