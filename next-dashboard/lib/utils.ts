// Utility functions for the trading dashboard

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely using clsx + tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random unique ID (used for new rows).
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Format a Date object to a readable string like "May 16, 2024 9:45 AM".
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Convert a file to a base64 data URL string for localStorage persistence.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Returns a CSS gradient color string based on ticker string (for placeholder logos).
 */
export function tickerGradient(ticker: string): string {
  const colors: Record<string, string> = {
    NVDA: 'from-green-500 to-green-700',
    TSLA: 'from-red-500 to-red-700',
    AMZN: 'from-orange-400 to-orange-600',
    MSFT: 'from-blue-500 to-blue-700',
    AAPL: 'from-gray-400 to-gray-600',
    SPY: 'from-indigo-500 to-indigo-700',
    QQQ: 'from-purple-500 to-purple-700',
    IWM: 'from-teal-500 to-teal-700',
  };
  return colors[ticker.toUpperCase()] || 'from-slate-400 to-slate-600';
}

/**
 * Filter dashboard data across all sections by a ticker search string.
 */
export function matchesTicker(ticker: string, search: string): boolean {
  return ticker.toLowerCase().includes(search.toLowerCase());
}
