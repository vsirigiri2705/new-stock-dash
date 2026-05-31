// Sample data matching the dashboard mockup

import { DashboardData } from './types';

export const mockDashboardData: DashboardData = {
  levels: [
    {
      id: '1',
      ticker: 'SPY',
      callWall: '530.00',
      putWall: '520.00',
      magnet1: '525.50',
      magnet2: '522.00',
      hanLevel: '527.00',
      andrewLevel: '519.50',
      lastUpdated: 'May 16, 2024 9:45 AM',
    },
    {
      id: '2',
      ticker: 'QQQ',
      callWall: '448.00',
      putWall: '435.00',
      magnet1: '442.00',
      magnet2: '438.50',
      hanLevel: '445.00',
      andrewLevel: '433.00',
      lastUpdated: 'May 16, 2024 9:45 AM',
    },
  ],
  swingOptions: [
    {
      id: '1',
      ticker: 'AAPL',
      strikePrice: '175.00',
      expirationDate: 'Jun 21, 2024',
      contractValue: '$2.45',
      comments: 'Strong support at 170. Watch for breakout above 177.',
    },
  ],
  earnings: [
    {
      id: '1',
      ticker: 'NVDA',
      earningsDate: 'May 22, 2024',
      comments: 'Expected strong guidance on AI chip demand.',
    },
    {
      id: '2',
      ticker: 'TGT',
      earningsDate: 'May 22, 2024',
      comments: 'Consumer spending pressure. Watch margins.',
    },
    {
      id: '3',
      ticker: 'WMT',
      earningsDate: 'May 16, 2024',
      comments: 'Defensive play. Grocery strength expected.',
    },
  ],
  trends: [
    {
      id: '1',
      ticker: 'SPY',
      trend: 'Bullish',
      comments: 'Above all major MAs. Momentum strong.',
    },
    {
      id: '2',
      ticker: 'QQQ',
      trend: 'Bullish',
      comments: 'Tech leading. Watch NVDA for direction.',
    },
    {
      id: '3',
      ticker: 'IWM',
      trend: 'Bearish',
      comments: 'Small caps lagging. Rates pressure.',
    },
  ],
  opportunities: [
    {
      id: '1',
      ticker: 'NVDA',
      logoUrl: '',
      chartImage: '',
      comments: 'AI momentum play. Earnings catalyst upcoming. Bull flag forming on daily.',
    },
    {
      id: '2',
      ticker: 'TSLA',
      logoUrl: '',
      chartImage: '',
      comments: 'Oversold bounce setup. Watch 180 level as key resistance.',
    },
    {
      id: '3',
      ticker: 'AMZN',
      logoUrl: '',
      chartImage: '',
      comments: 'AWS growth accelerating. Cloud sector rotation beneficiary.',
    },
    {
      id: '4',
      ticker: 'MSFT',
      logoUrl: '',
      chartImage: '',
      comments: 'Copilot integration driving enterprise adoption. Steady accumulation.',
    },
  ],
  publishedAt: undefined,
};
