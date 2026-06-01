export type TradeImportRow = {
  symbol: string;
  side?: string;
  quantity?: number;
  price?: number;
  executedAt: Date;
  pnl: number;
  fees?: number;
  commission?: number;
  orderId?: string;
  sourceAccount?: string;
  rawRow: Record<string, string>;
};

export type TradeFilters = {
  symbol?: string;
  startDate?: string;
  endDate?: string;
  setupTag?: string;
  outcome?: "win" | "loss";
};
