'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboardData } from '@/lib/storage';
import { generateId, formatTimestamp, fileToBase64 } from '@/lib/utils';
import { SectionType } from '@/lib/types';
import { toast } from 'sonner';
import { Save, PlusCircle } from 'lucide-react';

/**
 * Full form for adding entries to each dashboard section.
 * Data is persisted to localStorage via useDashboardData.
 */
export default function DashboardInputForm() {
  const [data, setData] = useDashboardData();
  const [section, setSection] = useState<SectionType>('levels');

  // ── Levels form state ──────────────────────────────────────────────────────
  const [levelForm, setLevelForm] = useState({
    ticker: '', callWall: '', putWall: '', magnet1: '', magnet2: '', hanLevel: '', andrewLevel: '',
  });

  // ── Swing Options form state ───────────────────────────────────────────────
  const [soForm, setSoForm] = useState({
    ticker: '', strikePrice: '', expirationDate: '', contractValue: '', comments: '',
  });

  // ── Earnings form state ────────────────────────────────────────────────────
  const [earnForm, setEarnForm] = useState({
    ticker: '', earningsDate: '', comments: '',
  });

  // ── Trends form state ──────────────────────────────────────────────────────
  const [trendForm, setTrendForm] = useState({
    ticker: '', trend: 'Bullish' as 'Bullish' | 'Bearish' | 'Neutral', comments: '',
  });

  // ── Opportunities form state ───────────────────────────────────────────────
  const [oppForm, setOppForm] = useState({
    ticker: '', chartImage: '', comments: '',
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setOppForm((f) => ({ ...f, chartImage: b64 }));
      toast.success('Image loaded');
    } catch {
      toast.error('Failed to read image');
    }
  }

  // ── Save handlers ──────────────────────────────────────────────────────────

  function saveLevel() {
    if (!levelForm.ticker.trim()) { toast.error('Ticker is required'); return; }
    const now = formatTimestamp();
    setData((d) => ({
      ...d,
      levels: [...d.levels, { id: generateId(), ...levelForm, lastUpdated: now }],
    }));
    setLevelForm({ ticker: '', callWall: '', putWall: '', magnet1: '', magnet2: '', hanLevel: '', andrewLevel: '' });
    toast.success(`Level for ${levelForm.ticker} saved!`);
  }

  function saveSwingOption() {
    if (!soForm.ticker.trim()) { toast.error('Ticker is required'); return; }
    setData((d) => ({ ...d, swingOptions: [...d.swingOptions, { id: generateId(), ...soForm }] }));
    setSoForm({ ticker: '', strikePrice: '', expirationDate: '', contractValue: '', comments: '' });
    toast.success(`Swing option for ${soForm.ticker} saved!`);
  }

  function saveEarning() {
    if (!earnForm.ticker.trim()) { toast.error('Ticker is required'); return; }
    setData((d) => ({ ...d, earnings: [...d.earnings, { id: generateId(), ...earnForm }] }));
    setEarnForm({ ticker: '', earningsDate: '', comments: '' });
    toast.success(`Earnings for ${earnForm.ticker} saved!`);
  }

  function saveTrend() {
    if (!trendForm.ticker.trim()) { toast.error('Ticker is required'); return; }
    setData((d) => ({ ...d, trends: [...d.trends, { id: generateId(), ...trendForm }] }));
    setTrendForm({ ticker: '', trend: 'Bullish', comments: '' });
    toast.success(`Trend for ${trendForm.ticker} saved!`);
  }

  function saveOpportunity() {
    if (!oppForm.ticker.trim()) { toast.error('Ticker is required'); return; }
    setData((d) => ({
      ...d,
      opportunities: [...d.opportunities, { id: generateId(), logoUrl: '', ...oppForm }],
    }));
    setOppForm({ ticker: '', chartImage: '', comments: '' });
    toast.success(`Opportunity for ${oppForm.ticker} saved!`);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto">
      {/* Section selector */}
      <div className="mb-6">
        <Label className="mb-2 block text-base font-semibold text-gray-800">Select Section</Label>
        <Select value={section} onValueChange={(v) => setSection(v as SectionType)}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="levels">Levels Board</SelectItem>
            <SelectItem value="swingOptions">Swing Options</SelectItem>
            <SelectItem value="earnings">Weekly Earnings</SelectItem>
            <SelectItem value="trends">Stock Trends</SelectItem>
            <SelectItem value="opportunities">Opportunities</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── LEVELS FORM ── */}
      {section === 'levels' && (
        <FormCard title="Add Level Row" onSave={saveLevel}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ticker" value={levelForm.ticker} onChange={(v) => setLevelForm((f) => ({ ...f, ticker: v.toUpperCase() }))} placeholder="SPY" />
            <Field label="Call Wall" value={levelForm.callWall} onChange={(v) => setLevelForm((f) => ({ ...f, callWall: v }))} placeholder="530.00" />
            <Field label="Put Wall" value={levelForm.putWall} onChange={(v) => setLevelForm((f) => ({ ...f, putWall: v }))} placeholder="520.00" />
            <Field label="Magnet 1" value={levelForm.magnet1} onChange={(v) => setLevelForm((f) => ({ ...f, magnet1: v }))} placeholder="525.50" />
            <Field label="Magnet 2" value={levelForm.magnet2} onChange={(v) => setLevelForm((f) => ({ ...f, magnet2: v }))} placeholder="522.00" />
            <Field label="HAN Level" value={levelForm.hanLevel} onChange={(v) => setLevelForm((f) => ({ ...f, hanLevel: v }))} placeholder="527.00" />
            <Field label="Andrew Level" value={levelForm.andrewLevel} onChange={(v) => setLevelForm((f) => ({ ...f, andrewLevel: v }))} placeholder="519.50" />
          </div>
        </FormCard>
      )}

      {/* ── SWING OPTIONS FORM ── */}
      {section === 'swingOptions' && (
        <FormCard title="Add Swing Option" onSave={saveSwingOption}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ticker" value={soForm.ticker} onChange={(v) => setSoForm((f) => ({ ...f, ticker: v.toUpperCase() }))} placeholder="AAPL" />
              <Field label="Strike Price" value={soForm.strikePrice} onChange={(v) => setSoForm((f) => ({ ...f, strikePrice: v }))} placeholder="175.00" />
              <Field label="Expiration Date" value={soForm.expirationDate} onChange={(v) => setSoForm((f) => ({ ...f, expirationDate: v }))} placeholder="Jun 21, 2024" />
              <Field label="Contract Value" value={soForm.contractValue} onChange={(v) => setSoForm((f) => ({ ...f, contractValue: v }))} placeholder="$2.45" />
            </div>
            <div className="space-y-1.5">
              <Label>Comments</Label>
              <Textarea value={soForm.comments} onChange={(e) => setSoForm((f) => ({ ...f, comments: e.target.value }))} placeholder="Setup notes..." rows={3} />
            </div>
          </div>
        </FormCard>
      )}

      {/* ── EARNINGS FORM ── */}
      {section === 'earnings' && (
        <FormCard title="Add Earnings" onSave={saveEarning}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ticker" value={earnForm.ticker} onChange={(v) => setEarnForm((f) => ({ ...f, ticker: v.toUpperCase() }))} placeholder="NVDA" />
              <Field label="Earnings Date" value={earnForm.earningsDate} onChange={(v) => setEarnForm((f) => ({ ...f, earningsDate: v }))} placeholder="May 22, 2024" />
            </div>
            <div className="space-y-1.5">
              <Label>Comments</Label>
              <Textarea value={earnForm.comments} onChange={(e) => setEarnForm((f) => ({ ...f, comments: e.target.value }))} placeholder="Notes..." rows={3} />
            </div>
          </div>
        </FormCard>
      )}

      {/* ── TRENDS FORM ── */}
      {section === 'trends' && (
        <FormCard title="Add Stock Trend" onSave={saveTrend}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ticker" value={trendForm.ticker} onChange={(v) => setTrendForm((f) => ({ ...f, ticker: v.toUpperCase() }))} placeholder="SPY" />
              <div className="space-y-1.5">
                <Label>Trend Direction</Label>
                <Select value={trendForm.trend} onValueChange={(v) => setTrendForm((f) => ({ ...f, trend: v as typeof trendForm.trend }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bullish">Bullish</SelectItem>
                    <SelectItem value="Bearish">Bearish</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Comments</Label>
              <Textarea value={trendForm.comments} onChange={(e) => setTrendForm((f) => ({ ...f, comments: e.target.value }))} placeholder="Market analysis..." rows={3} />
            </div>
          </div>
        </FormCard>
      )}

      {/* ── OPPORTUNITIES FORM ── */}
      {section === 'opportunities' && (
        <FormCard title="Add Opportunity" onSave={saveOpportunity}>
          <div className="space-y-4">
            <Field label="Ticker" value={oppForm.ticker} onChange={(v) => setOppForm((f) => ({ ...f, ticker: v.toUpperCase() }))} placeholder="NVDA" />
            <div className="space-y-1.5">
              <Label>Chart Image (optional)</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
              />
              {oppForm.chartImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={oppForm.chartImage} alt="Preview" className="mt-2 rounded h-24 object-cover w-full border border-gray-200" />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Comments / Trade Thesis</Label>
              <Textarea value={oppForm.comments} onChange={(e) => setOppForm((f) => ({ ...f, comments: e.target.value }))} placeholder="Setup details, entry/exit levels..." rows={4} />
            </div>
          </div>
        </FormCard>
      )}

      {/* Current counts summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Data Summary</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {([
            { label: 'Levels', count: data.levels.length },
            { label: 'Swing Opts', count: data.swingOptions.length },
            { label: 'Earnings', count: data.earnings.length },
            { label: 'Trends', count: data.trends.length },
            { label: 'Opportunities', count: data.opportunities.length },
          ]).map(({ label, count }) => (
            <div key={label} className="text-center bg-white rounded-md p-2 border border-gray-100">
              <p className="text-xl font-bold text-blue-600">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

interface FormCardProps {
  title: string;
  onSave: () => void;
  children: React.ReactNode;
}

function FormCard({ title, onSave, children }: FormCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-blue-500" />
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
      <div className="px-5 pb-5">
        <Button onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Entry
        </Button>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function Field({ label, value, onChange, placeholder }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
