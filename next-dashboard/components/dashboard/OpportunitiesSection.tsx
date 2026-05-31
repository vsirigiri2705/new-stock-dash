'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, ZoomIn } from 'lucide-react';
import { Opportunity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import DashboardCard from './DashboardCard';
import ChartPreviewModal from './ChartPreviewModal';
import { generateId, tickerGradient, fileToBase64 } from '@/lib/utils';
import { toast } from 'sonner';

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
  onUpdate: (o: Opportunity[]) => void;
  searchFilter: string;
}

const emptyOpp = (): Omit<Opportunity, 'id'> => ({
  ticker: '',
  logoUrl: '',
  chartImage: '',
  comments: '',
});

export default function OpportunitiesSection({
  opportunities,
  onUpdate,
  searchFilter,
}: OpportunitiesSectionProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpp, setPreviewOpp] = useState<Opportunity | null>(null);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [form, setForm] = useState(emptyOpp());

  const filtered = opportunities.filter((r) =>
    r.ticker.toLowerCase().includes(searchFilter.toLowerCase())
  );

  function openEdit(row: Opportunity | null) {
    if (row) { setEditing(row); setForm({ ticker: row.ticker, logoUrl: row.logoUrl, chartImage: row.chartImage, comments: row.comments }); }
    else { setEditing(null); setForm(emptyOpp()); }
    setEditOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setForm((f) => ({ ...f, chartImage: b64 }));
      toast.success('Image loaded');
    } catch {
      toast.error('Failed to read image');
    }
  }

  function handleSave() {
    if (!form.ticker.trim()) { toast.error('Ticker required'); return; }
    if (editing) {
      onUpdate(opportunities.map((r) => (r.id === editing.id ? { ...editing, ...form } : r)));
      toast.success(`Updated ${form.ticker}`);
    } else {
      onUpdate([...opportunities, { id: generateId(), ...form }]);
      toast.success(`Added ${form.ticker}`);
    }
    setEditOpen(false);
  }

  function handleDelete(row: Opportunity) { setEditing(row); setDeleteOpen(true); }
  function confirmDelete() {
    if (!editing) return;
    onUpdate(opportunities.filter((r) => r.id !== editing.id));
    toast.success(`Deleted ${editing.ticker}`);
    setDeleteOpen(false); setEditing(null);
  }

  const footer = (
    <Button size="sm" variant="outline" onClick={() => openEdit(null)} className="gap-1.5">
      <Pencil className="h-3.5 w-3.5" /> Add Opportunity
    </Button>
  );

  return (
    <>
      <DashboardCard title="Opportunities" footer={footer}>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No opportunities found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((opp) => {
              const gradient = tickerGradient(opp.ticker);
              return (
                <div
                  key={opp.id}
                  className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Chart thumbnail */}
                  <div
                    className={`relative h-32 bg-gradient-to-br ${gradient} cursor-pointer`}
                    onClick={() => setPreviewOpp(opp)}
                  >
                    {opp.chartImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={opp.chartImage}
                        alt={`${opp.ticker} chart`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-3xl font-bold text-white opacity-80">{opp.ticker[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      {/* Ticker logo square */}
                      <div className={`flex items-center gap-2`}>
                        <div className={`w-7 h-7 rounded bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                          <span className="text-xs font-bold text-white">{opp.ticker[0]}</span>
                        </div>
                        <span className="font-semibold text-sm text-blue-600">{opp.ticker}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(opp)} className="p-1 rounded hover:bg-blue-50 text-blue-500 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(opp)} className="p-1 rounded hover:bg-red-50 text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-3">{opp.comments}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashboardCard>

      {/* Chart Preview Modal */}
      <ChartPreviewModal
        opportunity={previewOpp}
        open={!!previewOpp}
        onClose={() => setPreviewOpp(null)}
      />

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.ticker}` : 'Add Opportunity'}</DialogTitle>
            <DialogDescription>Enter opportunity details and optionally upload a chart image.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Ticker</Label>
              <Input value={form.ticker} onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value.toUpperCase() }))} placeholder="NVDA" />
            </div>
            <div className="space-y-1.5">
              <Label>Chart Image (optional)</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
              />
              {form.chartImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.chartImage} alt="Preview" className="mt-2 rounded h-24 object-cover w-full" />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Comments</Label>
              <Textarea value={form.comments} onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))} placeholder="Trade thesis, setup notes..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Opportunity</DialogTitle>
            <DialogDescription>Delete <strong>{editing?.ticker}</strong>?</DialogDescription>
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
