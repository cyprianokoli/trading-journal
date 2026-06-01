import Papa from "papaparse";

import { parseInteger, parseNumber } from "@/lib/utils";
import type { TradeImportRow } from "@/lib/types";

const FIELD_PATTERNS = {
  symbol: ["symbol", "contract", "product", "instrument", "market"],
  side: ["buy/sell", "b/s", "side", "action", "bs"],
  quantity: ["filled qty", "filled quantity", "quantity", "qty", "contracts"],
  price: [
    "avg fill price",
    "fill price",
    "average price",
    "avg price",
    "buy price",
    "sell price",
    "price",
  ],
  executedAt: [
    "bought timestamp",
    "sold timestamp",
    "filled time",
    "execution time",
    "date/time",
    "timestamp",
    "time",
    "date",
  ],
  pnl: ["pnl", "net pnl", "realized pnl", "profit", "pl"],
  fees: ["fees", "fee", "exchange fee", "nfa fee"],
  commission: ["commission", "commissions"],
  orderId: ["order id", "orderid", "buy fill id", "sell fill id", "fill id", "id"],
  account: ["account", "account name", "acct", "tradovate account"],
} as const;

function normalizeHeader(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findField(headers: string[], patterns: readonly string[]) {
  for (const pattern of patterns) {
    const exact = headers.find((header) => header === pattern);
    if (exact) {
      return exact;
    }
  }

  for (const pattern of patterns) {
    const boundary = headers.find(
      (header) =>
        header.startsWith(`${pattern} `) ||
        header.endsWith(` ${pattern}`) ||
        header.includes(` ${pattern} `),
    );
    if (boundary) {
      return boundary;
    }
  }

  return headers.find((header) =>
    patterns.some((pattern) => header.includes(pattern)),
  );
}

function getValue(row: Record<string, string>, normalizedKey?: string) {
  if (!normalizedKey) {
    return "";
  }

  return row[normalizedKey] ?? "";
}

function parseDate(value: string) {
  const trimmed = value.trim();
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const [datePart, timePart] = trimmed.split(" ");
  if (datePart?.includes("/") && timePart) {
    const [month, day, year] = datePart.split("/").map(Number);
    const fallback = new Date(year, month - 1, day);
    if (!Number.isNaN(fallback.getTime())) {
      return fallback;
    }
  }

  throw new Error(`Unable to parse trade timestamp: ${value}`);
}

export function parseTradovateCsv(csvText: string): TradeImportRow[] {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  });

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0]?.message || "Failed to parse CSV");
  }

  const headers = (parsed.meta.fields || []).map(normalizeHeader);
  const symbolField = findField(headers, FIELD_PATTERNS.symbol);
  const sideField = findField(headers, FIELD_PATTERNS.side);
  const quantityField = findField(headers, FIELD_PATTERNS.quantity);
  const priceField = findField(headers, FIELD_PATTERNS.price);
  const timeField = findField(headers, FIELD_PATTERNS.executedAt);
  const soldTimeField = headers.find((header) => header === "sold timestamp");
  const pnlField = findField(headers, FIELD_PATTERNS.pnl);
  const feesField = findField(headers, FIELD_PATTERNS.fees);
  const commissionField = findField(headers, FIELD_PATTERNS.commission);
  const orderIdField = findField(headers, FIELD_PATTERNS.orderId);
  const accountField = findField(headers, FIELD_PATTERNS.account);

  if (!symbolField || !timeField || !pnlField) {
    throw new Error(
      "CSV is missing required trade fields. Make sure symbol, time, and PnL columns are included.",
    );
  }

  return parsed.data
    .map<TradeImportRow | null>((row) => {
      const symbol = getValue(row, symbolField).trim();
      const executedAt = parseDate(getValue(row, soldTimeField || timeField));
      const pnl = parseNumber(getValue(row, pnlField));

      if (!symbol) {
        return null;
      }

      return {
        symbol,
        side: getValue(row, sideField).trim() || undefined,
        quantity: quantityField ? parseInteger(getValue(row, quantityField)) : undefined,
        price: priceField ? parseNumber(getValue(row, priceField)) : undefined,
        executedAt,
        pnl,
        fees: feesField ? parseNumber(getValue(row, feesField)) : 0,
        commission: commissionField ? parseNumber(getValue(row, commissionField)) : 0,
        orderId: getValue(row, orderIdField).trim() || undefined,
        sourceAccount: getValue(row, accountField).trim() || undefined,
        rawRow: row,
      } satisfies TradeImportRow;
    })
    .filter((row): row is TradeImportRow => row !== null);
}
