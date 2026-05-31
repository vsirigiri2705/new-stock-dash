// Core data types for the trading dashboard

export interface LevelRow {
  id: string;
  ticker: string;
  callWall: string;
  putWall: string;
  magnet1: string;
  magnet2: string;
  hanLevel: string;
  andrewLevel: string;
  lastUpdated: string;
}

export interface SwingOption {
  id: string;
  ticker: string;
  strikePrice: string;
  expirationDate: string;
  contractValue: string;
  comments: string;
}

export interface Earning {
  id: string;
  ticker: string;
  earningsDate: string;
  comments: string;
}

export interface StockTrend {
  id: string;
  ticker: string;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  comments: string;
}

export interface Opportunity {
  id: string;
  ticker: string;
  logoUrl: string;
  chartImage: string;
  comments: string;
}

export interface DashboardData {
  levels: LevelRow[];
  swingOptions: SwingOption[];
  earnings: Earning[];
  trends: StockTrend[];
  opportunities: Opportunity[];
  publishedAt?: string;
}

// Form section type for Dashboard Input page
export type SectionType = 'levels' | 'swingOptions' | 'earnings' | 'trends' | 'opportunities';
