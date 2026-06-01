import type { Account, Trade } from "@prisma/client";

import { startOfTradingDay } from "@/lib/utils";

type PlainTrade = Pick<
  Trade,
  | "id"
  | "symbol"
  | "setupTag"
  | "mistakeTag"
  | "executedAt"
  | "pnl"
  | "fees"
  | "commission"
  | "quantity"
>;

export function decimalToNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (value && typeof value === "object" && "toNumber" in value && typeof value.toNumber === "function") {
    return value.toNumber();
  }

  return 0;
}

export function calculateAccountAnalytics(
  account: Pick<Account, "startingBalance" | "payoutTarget" | "maxDrawdown" | "consistencyThreshold"> & {
    costPerContract?: unknown;
  },
  trades: PlainTrade[],
) {
  const costPerContract = decimalToNumber(account.costPerContract);
  const normalizedTrades = trades
    .map((trade) => ({
      ...trade,
      grossPnl: decimalToNumber(trade.pnl),
      fees: decimalToNumber(trade.fees),
      commission: decimalToNumber(trade.commission),
      quantity: Number(trade.quantity || 0),
    }))
    .map((trade) => {
      const importedCosts = trade.fees + trade.commission;
      const estimatedCosts = trade.quantity > 0 ? trade.quantity * costPerContract : 0;
      const costs = importedCosts > 0 ? importedCosts : estimatedCosts;

      return {
        ...trade,
        netPnl: trade.grossPnl - costs,
        costs,
      };
    });

  const totalTrades = normalizedTrades.length;
  const grossPnl = normalizedTrades.reduce((sum, trade) => sum + trade.grossPnl, 0);
  const totalCosts = normalizedTrades.reduce((sum, trade) => sum + trade.costs, 0);
  const netPnl = normalizedTrades.reduce((sum, trade) => sum + trade.netPnl, 0);
  const winners = normalizedTrades.filter((trade) => trade.grossPnl > 0);
  const losers = normalizedTrades.filter((trade) => trade.grossPnl < 0);
  const grossProfit = winners.reduce((sum, trade) => sum + trade.grossPnl, 0);
  const grossLoss = Math.abs(losers.reduce((sum, trade) => sum + trade.grossPnl, 0));
  const averageWinner = winners.length ? grossProfit / winners.length : 0;
  const averageLoser = losers.length ? losers.reduce((sum, trade) => sum + trade.grossPnl, 0) / losers.length : 0;
  const winRate = totalTrades ? (winners.length / totalTrades) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0;
  const totalContracts = normalizedTrades.reduce((sum, trade) => sum + trade.quantity, 0);
  const winningContracts = winners.reduce((sum, trade) => sum + trade.quantity, 0);
  const losingContracts = losers.reduce((sum, trade) => sum + trade.quantity, 0);
  const largestWinningTrade = winners.reduce((best, trade) => Math.max(best, trade.grossPnl), 0);
  const largestLosingTrade = losers.reduce((worst, trade) => Math.min(worst, trade.grossPnl), 0);

  const dailyMap = new Map<string, number>();
  const symbolMap = new Map<string, { pnl: number; trades: number }>();
  const setupMap = new Map<string, { pnl: number; trades: number; wins: number }>();
  const hourMap = new Map<string, { pnl: number; trades: number }>();

  let runningBalance = decimalToNumber(account.startingBalance);
  let peakBalance = runningBalance;
  let maxDrawdownUsed = 0;
  let largestWinningDay = 0;

  const equityCurve = normalizedTrades
    .sort((a, b) => a.executedAt.getTime() - b.executedAt.getTime())
    .map((trade) => {
      runningBalance += trade.netPnl;
      peakBalance = Math.max(peakBalance, runningBalance);
      maxDrawdownUsed = Math.max(maxDrawdownUsed, peakBalance - runningBalance);
      largestWinningDay = Math.max(largestWinningDay, trade.netPnl);

      const dayKey = startOfTradingDay(trade.executedAt).toISOString();
      dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + trade.netPnl);

      const symbolEntry = symbolMap.get(trade.symbol) || { pnl: 0, trades: 0 };
      symbolEntry.pnl += trade.netPnl;
      symbolEntry.trades += 1;
      symbolMap.set(trade.symbol, symbolEntry);

      const setupKey = trade.setupTag || "Unlabeled";
      const setupEntry = setupMap.get(setupKey) || { pnl: 0, trades: 0, wins: 0 };
      setupEntry.pnl += trade.netPnl;
      setupEntry.trades += 1;
      setupEntry.wins += trade.grossPnl > 0 ? 1 : 0;
      setupMap.set(setupKey, setupEntry);

      const hourKey = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
      }).format(trade.executedAt);
      const hourEntry = hourMap.get(hourKey) || { pnl: 0, trades: 0 };
      hourEntry.pnl += trade.netPnl;
      hourEntry.trades += 1;
      hourMap.set(hourKey, hourEntry);

      return {
        date: trade.executedAt.toISOString(),
        balance: runningBalance,
        pnl: trade.netPnl,
      };
    });

  const dailyPerformance = [...dailyMap.entries()]
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const bestDay = dailyPerformance.reduce((best, day) => (day.pnl > best.pnl ? day : best), {
    date: "",
    pnl: 0,
  });
  const worstDay = dailyPerformance.reduce((worst, day) => (day.pnl < worst.pnl ? day : worst), {
    date: "",
    pnl: 0,
  });

  const symbolPerformance = [...symbolMap.entries()]
    .map(([symbol, value]) => ({
      symbol,
      pnl: value.pnl,
      trades: value.trades,
    }))
    .sort((a, b) => b.pnl - a.pnl);

  const setupPerformance = [...setupMap.entries()]
    .map(([setup, value]) => ({
      setup,
      pnl: value.pnl,
      trades: value.trades,
      winRate: value.trades ? (value.wins / value.trades) * 100 : 0,
    }))
    .sort((a, b) => b.pnl - a.pnl);

  const timeOfDayPerformance = [...hourMap.entries()]
    .map(([hour, value]) => ({
      hour,
      pnl: value.pnl,
      trades: value.trades,
    }))
    .sort((a, b) => Number(a.hour) - Number(b.hour));

  const largestWinningDayPnl = dailyPerformance.reduce(
    (best, day) => Math.max(best, day.pnl),
    0,
  );
  const consistencyThreshold = decimalToNumber(account.consistencyThreshold);
  const consistencyPct =
    netPnl > 0 ? (largestWinningDayPnl / netPnl) * 100 : 0;
  const distanceToPayoutTarget = Math.max(decimalToNumber(account.payoutTarget) - netPnl, 0);
  const distanceToDrawdownLimit = Math.max(decimalToNumber(account.maxDrawdown) - maxDrawdownUsed, 0);

  return {
    grossPnl,
    totalCosts,
    netPnl,
    totalTrades,
    totalContracts,
    winningContracts,
    losingContracts,
    winRate,
    averageWinner,
    averageLoser,
    profitFactor,
    largestWinningTrade,
    largestLosingTrade,
    bestDay,
    worstDay,
    consistencyPct,
    consistencyThreshold,
    distanceToPayoutTarget,
    distanceToDrawdownLimit,
    currentBalance: decimalToNumber(account.startingBalance) + netPnl,
    grossProfit,
    grossLoss,
    dailyPerformance,
    equityCurve,
    symbolPerformance,
    setupPerformance,
    timeOfDayPerformance,
  };
}
