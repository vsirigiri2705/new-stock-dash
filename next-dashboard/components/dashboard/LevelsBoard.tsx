'use client';

import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { LevelRow } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import DashboardCard from './DashboardCard';
import { generateId, formatTimestamp } from '@/lib/utils';
import { toast } from 'sonner';

interface LevelsBoardProps {
  levels: LevelRow[];
  onUpdate: (levels: LevelRow[]) => void;
  searchFilter: string;
}

// Empty form state for new/edit row
const emptyLevel = (): Omit<LevelRow, 'id' | 'lastUpdated'> => ({
  ticker: '',
  callWall: '',
  putWall: '',
  magnet1: '',
  magnet2: '',
  hanLevel: '',
  andrewLevel: '',
});

export default function LevelsBoard({ levels, onUpdate, searchFilter }: LevelsBoardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<LevelRow | null>(null);
  const [form, setForm] = useState(emptyLevel());

  // Filter by ticker search
  const filtered = levels.filter((r) =>
    r.ticker.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const lastUpdated = levels[0]?.lastUpdated ?? formatTimestamp();

  // Open edit dialog for a row (or add new if null)
  function openEdit(row: LevelRow | null) {
    if (row) {
      setEditingRow(row);
      setForm({
        ticker: row.ticker,
        callWall: row.callWall,
        putWall: row.putWall,
        magnet1: row.magnet1,
        magnet2: row.magnet2,
        hanLevel: row.hanLevel,
        andrewLevel: row.andrewLevel,
      });
    } else {
      setEditingRow(null);
      setForm(emptyLevel());
    }
    setEditOpen(true);
  }

  function handleSave() {
    if (!form.ticker.trim()) {
      toast.error('Ticker is required');
      return;
    }
    const now = formatTimestamp();
    if (editingRow) {
      // Update existing
      onUpdate(
        levels.map((r) =>
          r.id === editingRow.id ? { ...editingRow, ...form, lastUpdated: now } : r
        )
      );
      toast.success(`Updated ${form.ticker} level`);
    } else {
      // Add new
      onUpdate([...levels, { id: generateId(), ...form, lastUpdated: now }]);
      toast.success(`Added ${form.ticker} level`);
    }
    setEditOpen(false);
  }

  function handleDelete(row: LevelRow) {
    setEditingRow(row);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (!editingRow) return;
    onUpdate(levels.filter((r) => r.id !== editingRow.id));
    toast.success(`Deleted ${editingRow.ticker} level`);
    setDeleteOpen(false);
    setEditingRow(null);
  }

  const footer = (
    <>
      <Button size="sm" variant="outline" onClick={() => openEdit(null)} className="gap-1.5">
        <Pencil className="h-3.5 w-3.5" /> Add / Edit
      </Button>
    </>
  );

  return (
    <>
      <DashboardCard title="SPY & QQQ Levels Board" footer={footer} defaultCollapsed={false}>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No levels data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Ticker', 'Call Wall', 'Put Wall', 'Magnet 1', 'Magnet 2', 'HAN Level', 'Andrew Level', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-2 text-xs font-semibold uppercase text-gray-400 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-2 font-semibold text-blue-600">{row.ticker}</td>
                    <td className="py-2 px-2 text-green-500 font-medium">{row.callWall}</td>
                    <td className="py-2 px-2 text-red-500 font-medium">{row.putWall}</td>
                    <td className="py-2 px-2 text-gray-700">{row.magnet1}</td>
                    <td className="py-2 px-2 text-gray-700">{row.magnet2}</td>
                    <td className="py-2 px-2 text-gray-700">{row.hanLevel}</td>
                    <td className="py-2 px-2 text-gray-700">{row.andrewLevel}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-1 rounded hover:bg-blue-50 text-blue-500 transition-colors"
                          title="Edit row"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="p-1 rounded hover:bg-red-50 text-red-400 transition-colors"
                          title="Delete row"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">Last Updated: {lastUpdated}</p>
          </div>
        )}
      </DashboardCard>

      {/* Edit / Add Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRow ? `Edit ${editingRow.ticker}` : 'Add New Level Row'}</DialogTitle>
            <DialogDescription>Fill in the level values for this ticker.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {(
              [
                { key: 'ticker', label: 'Ticker' },
                { key: 'callWall', label: 'Call Wall' },
                { key: 'putWall', label: 'Put Wall' },
                { key: 'magnet1', label: 'Magnet 1' },
                { key: 'magnet2', label: 'Magnet 2' },
                { key: 'hanLevel', label: 'HAN Level' },
                { key: 'andrewLevel', label: 'Andrew Level' },
              ] as { key: keyof typeof form; label: string }[]
            ).map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={`level-${key}`}>{label}</Label>
                <Input
                  id={`level-${key}`}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={label}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Level Row</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{editingRow?.ticker}</strong>? This cannot be undone.
            </DialogDescription>
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
