'use client';

// Custom localStorage hooks and utilities for dashboard persistence

import { useState, useEffect } from 'react';
import { DashboardData } from './types';
import { mockDashboardData } from './mockData';

const STORAGE_KEY = 'trading_dashboard_data';

/**
 * Custom hook for persisting state to localStorage.
 * Falls back to initialValue on SSR or if localStorage is unavailable.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sync to localStorage whenever value changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.error('Failed to write to localStorage');
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

/**
 * Hook specifically for the full DashboardData object.
 * Seeds with mockData if nothing is stored yet.
 */
export function useDashboardData(): [DashboardData, (data: DashboardData | ((prev: DashboardData) => DashboardData)) => void] {
  return useLocalStorage<DashboardData>(STORAGE_KEY, mockDashboardData);
}

/**
 * Direct read/write helpers (for use outside of React components).
 */
export const storage = {
  read(): DashboardData {
    if (typeof window === 'undefined') return mockDashboardData;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DashboardData) : mockDashboardData;
    } catch {
      return mockDashboardData;
    }
  },
  write(data: DashboardData): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      console.error('Failed to write dashboard data');
    }
  },
  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};
