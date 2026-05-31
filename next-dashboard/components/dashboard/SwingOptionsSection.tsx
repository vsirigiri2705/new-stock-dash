'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { SwingOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

interface SwingOptionsSectionProps {
  swingOptions: SwingOption[];
  onUpdate: (opts: SwingOption[]) => void;
  searchFilter: string;
}

const emptyOpt = (): Omit<SwingOption, 'id'> => ({
  ticker: '', strikePrice: '', expirationDate: '', contractValue: '', comments: '',
});

export default function SwingOptionsSection({ swingOptions, onUpdate, searchFilter }: SwingOptionsSectionProps) {
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing]       = useState<SwingOption | null>(null);
  const [detail, setDetail]         = useState<SwingOption | null>(null);
  const [form, setForm]             = useState(emptyOpt());

  const filtered = swingOptions.filter((r) =>
    r.ticker.toLowerCase().includes(searchFilter.toLowerCase())
  );

  function openDetail(row: SwingOption) { setDetail(row); setDetailOpen(true); }

  function openEdit(row: SwingOption | null) {
    if (row) { setEditing(row); setForm({ ticker: row.ticker, strikePrice: row.strikePrice, expirationDate: row.expirationDate, contractValue: row.contractValue, comments: row.comments }); }
    else     { setEditing(null); setForm(emptyOpt()); }
    setEditOpen(true);
  }

  function handleSave() {
    if (!form.ticker.trim()) { toast.error('Ticker is required'); return; }
    if (editing) {
      onUpdate(swingOptions.map((r) => (r.id === editing.id ? { ...editing, ...form } : r)));
      toast.success(`Updated ${form.ticker}`);
    } else {
      onUpdate([...swingOptions, { id: generateId(), ...form }]);
      toast.success(`Added ${form.ticker}`);
    }
    setEditOpen(false);
  }

  function handleDelete(row: SwingOption) { setEditing(row); setDeleteOpen(true); }

  function confirmDelete() {
    if (!editing) return;
    onUpdate(swingOptions.filter((r) => r.id !== editing.id));
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
      <DashboardCard title="Swing Options" footer={footer}>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No swing options found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Ticker', 'Strike Price', 'Date', 'Contract Value', 'Comments', ''].map((h) => (
                    <th key={h} className="text-left py-2 px-2 text-xs font-semibold uppercase text-gray-400 whitespace-nowrap">{h}</th>
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
                    <td className="py-2 px-2 text-gray-700">{row.strikePrice}</td>
                    <td className="py-2 px-2 text-gray-700 whitespace-nowrap">{row.expirationDate}</td>
                    <td className="py-2 px-2 text-gray-700">{row.contractValue}</td>
                    {/* Clickable comment */}
                    <td className="py-2 px-2 max-w-[180px]">
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
              <Badge variant="outline" className="text-xs font-normal">Swing Option</Badge>
            </DialogTitle>
            <DialogDescription>Full details for this swing option.</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-3">
                <DetailField label="Strike Price"    value={detail.strikePrice} />
                <DetailField label="Expiration Date" value={detail.expirationDate} />
                <DetailField label="Contract Value"  value={detail.contractValue ? `$${detail.contractValue}` : '—'} />
              </div>
              <div className="pt-1">
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
            <DialogTitle>{editing ? `Edit ${editing.ticker}` : 'Add Swing Option'}</DialogTitle>
            <DialogDescription>Enter the swing option details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {([
              { key: 'ticker',         label: 'Ticker' },
              { key: 'strikePrice',    label: 'Strike Price' },
              { key: 'expirationDate', label: 'Expiration Date' },
              { key: 'contractValue',  label: 'Contract Value' },
            ] as { key: keyof typeof form; label: string }[]).map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={`so-${key}`}>{label}</Label>
                <Input id={`so-${key}`} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={label} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="so-comments">Comments</Label>
              <Textarea id="so-comments" value={form.comments} onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))} placeholder="Additional notes..." rows={3} />
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
            <DialogTitle>Delete Swing Option</DialogTitle>
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

// Small reusable detail field
function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  );
}
