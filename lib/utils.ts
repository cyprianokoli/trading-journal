import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function toPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

export function toCompactDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function parseNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const sanitized = value.replace(/[$,%\s,()]/g, "").trim();
  if (!sanitized) {
    return 0;
  }

  const numeric = Number(sanitized);
  if (!Number.isNaN(numeric)) {
    return value.includes("(") && value.includes(")") ? -numeric : numeric;
  }

  return 0;
}

export function parseInteger(value: unknown) {
  return Math.round(parseNumber(value));
}

export function startOfTradingDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
