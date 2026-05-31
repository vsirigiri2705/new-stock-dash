'use client';

import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Earning } from '@/lib/types';
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
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';

interface EarningsSectionProps {
  earnings: Earning[];
  onUpdate: (e: Earning[]) => void;
  searchFilter: string;
}

const emptyEarning = (): Omit<Earning, 'id'> => ({
  ticker: '',
  earningsDate: '',
  comments: '',
});

export default function EarningsSection({ earnings, onUpdate, searchFilter }: EarningsSectionProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Earning | null>(null);
  const [form, setForm] = useState(emptyEarning());

  const filtered = earnings.filter((r) =>
    r.ticker.toLowerCase().includes(searchFilter.toLowerCase())
  );

  function openEdit(row: Earning | null) {
    if (row) { setEditing(row); setForm({ ticker: row.ticker, earningsDate: row.earningsDate, comments: row.comments }); }
    else { setEditing(null); setForm(emptyEarning()); }
    setEditOpen(true);
  }

  function handleSave() {
    if (!form.ticker.trim()) { toast.error('Ticker is required'); return; }
    if (editing) {
      onUpdate(earnings.map((r) => (r.id === editing.id ? { ...editing, ...form } : r)));
      toast.success(`Updated ${form.ticker}`);
    } else {
      onUpdate([...earnings, { id: generateId(), ...form }]);
      toast.success(`Added ${form.ticker}`);
    }
    setEditOpen(false);
  }

  function handleDelete(row: Earning) { setEditing(row); setDeleteOpen(true); }
  function confirmDelete() {
    if (!editing) return;
    onUpdate(earnings.filter((r) => r.id !== editing.id));
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
      <DashboardCard title="Weekly Known Earnings" footer={footer}>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No earnings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Ticker', 'Earnings Date', 'Comments', ''].map((h) => (
                    <th key={h} className="text-left py-2 px-2 text-xs font-semibold uppercase text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-2 font-semibold text-blue-600">{row.ticker}</td>
                    <td className="py-2 px-2 text-gray-700 whitespace-nowrap">{row.earningsDate}</td>
                    <td className="py-2 px-2 text-gray-500 max-w-[200px] truncate" title={row.comments}>{row.comments}</td>
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.ticker}` : 'Add Earning'}</DialogTitle>
            <DialogDescription>Enter earnings details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Ticker</Label>
              <Input value={form.ticker} onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value }))} placeholder="NVDA" />
            </div>
            <div className="space-y-1.5">
              <Label>Earnings Date</Label>
              <Input value={form.earningsDate} onChange={(e) => setForm((f) => ({ ...f, earningsDate: e.target.value }))} placeholder="May 22, 2024" />
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

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Earning</DialogTitle>
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
