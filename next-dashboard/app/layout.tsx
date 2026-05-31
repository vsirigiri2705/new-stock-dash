import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Trading Dashboard',
  description: 'Stock market levels, swing options, earnings, trends, and opportunities dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        <div className="flex min-h-screen">
          {/* Left sidebar — desktop only */}
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 min-w-0 overflow-auto">
            {children}
          </main>
        </div>

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
