"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { parseTradovateCsv } from "@/lib/tradovate-parser";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const raw = getString(formData, key);
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export async function createAccountAction(formData: FormData) {
  const name = getString(formData, "name");

  if (!name) {
    throw new Error("Account name is required.");
  }

  await prisma.account.create({
    data: {
      name,
      broker: getString(formData, "broker") || "Tradovate",
      provider: getString(formData, "provider") || "Lucid",
      startingBalance: new Prisma.Decimal(getNumber(formData, "startingBalance", 25000)),
      payoutTarget: new Prisma.Decimal(getNumber(formData, "payoutTarget", 1500)),
      maxDrawdown: new Prisma.Decimal(getNumber(formData, "maxDrawdown", 1500)),
      consistencyThreshold: new Prisma.Decimal(getNumber(formData, "consistencyThreshold", 30)),
      dailyLossLimit: new Prisma.Decimal(getNumber(formData, "dailyLossLimit", 0)),
      profitShare: new Prisma.Decimal(getNumber(formData, "profitShare", 0)),
      costPerContract: new Prisma.Decimal(getNumber(formData, "costPerContract", 1.0192513369)),
      trackingStartDate: getString(formData, "trackingStartDate")
        ? new Date(getString(formData, "trackingStartDate"))
        : null,
      notes: getString(formData, "notes") || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/settings");
}

export async function updateAccountRulesAction(formData: FormData) {
  const accountId = getString(formData, "accountId");

  if (!accountId) {
    throw new Error("Account is required.");
  }

  await prisma.account.update({
    where: { id: accountId },
    data: {
      name: getString(formData, "name"),
      startingBalance: new Prisma.Decimal(getNumber(formData, "startingBalance", 25000)),
      payoutTarget: new Prisma.Decimal(getNumber(formData, "payoutTarget", 1500)),
      maxDrawdown: new Prisma.Decimal(getNumber(formData, "maxDrawdown", 1500)),
      consistencyThreshold: new Prisma.Decimal(getNumber(formData, "consistencyThreshold", 30)),
      dailyLossLimit: new Prisma.Decimal(getNumber(formData, "dailyLossLimit", 0)),
      profitShare: new Prisma.Decimal(getNumber(formData, "profitShare", 0)),
      costPerContract: new Prisma.Decimal(getNumber(formData, "costPerContract", 1.0192513369)),
      trackingStartDate: getString(formData, "trackingStartDate")
        ? new Date(getString(formData, "trackingStartDate"))
        : null,
      notes: getString(formData, "notes") || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/analytics");
}

export async function uploadTradesAction(formData: FormData) {
  const accountId = getString(formData, "accountId");
  const file = formData.get("file");

  if (!accountId) {
    throw new Error("Select an account before importing trades.");
  }

  if (!(file instanceof File)) {
    throw new Error("Choose a CSV file to upload.");
  }

  const text = await file.text();
  const parsedTrades = parseTradovateCsv(text);

  if (parsedTrades.length === 0) {
    throw new Error("No trades were found in the uploaded CSV.");
  }

  await prisma.trade.createMany({
    data: parsedTrades.map((trade) => ({
      accountId,
      symbol: trade.symbol,
      side: trade.side,
      quantity: trade.quantity,
      price: trade.price ? new Prisma.Decimal(trade.price) : null,
      executedAt: trade.executedAt,
      pnl: new Prisma.Decimal(trade.pnl),
      fees: new Prisma.Decimal(trade.fees || 0),
      commission: new Prisma.Decimal(trade.commission || 0),
      orderId: trade.orderId,
      sourceAccount: trade.sourceAccount,
      rawRow: JSON.stringify(trade.rawRow),
    })),
  });

  revalidatePath("/");
  revalidatePath("/upload");
  revalidatePath("/trades");
  revalidatePath("/analytics");
}

export async function updateTradeJournalAction(formData: FormData) {
  const tradeId = getString(formData, "tradeId");

  if (!tradeId) {
    throw new Error("Trade ID is required.");
  }

  await prisma.trade.update({
    where: { id: tradeId },
    data: {
      setupTag: getString(formData, "setupTag") || null,
      mistakeTag: getString(formData, "mistakeTag") || null,
      screenshotUrl: getString(formData, "screenshotUrl") || null,
      notes: getString(formData, "notes") || null,
    },
  });

  revalidatePath("/trades");
  revalidatePath(`/trades/${tradeId}`);
  revalidatePath("/");
  revalidatePath("/analytics");
}

export async function deleteAccountAction(formData: FormData) {
  const accountId = getString(formData, "accountId");

  if (!accountId) {
    throw new Error("Account is required.");
  }

  await prisma.account.delete({
    where: { id: accountId },
  });

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/upload");
  revalidatePath("/trades");
  revalidatePath("/analytics");

  redirect("/settings");
}
