import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { TradeFilters } from "@/lib/types";

export async function getAccounts() {
  return prisma.account.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getSelectedAccount(accountId?: string | null) {
  const accounts = await getAccounts();
  const selected =
    (accountId && accounts.find((account) => account.id === accountId)) || accounts[0] || null;

  return { accounts, selected };
}

export async function getTrades(accountId: string, filters?: TradeFilters) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { trackingStartDate: true },
  });

  const where: Prisma.TradeWhereInput = {
    accountId,
  };

  if (filters?.symbol) {
    where.symbol = filters.symbol;
  }

  if (filters?.setupTag) {
    where.setupTag = filters.setupTag;
  }

  if (filters?.outcome === "win") {
    where.pnl = { gt: 0 };
  }

  if (filters?.outcome === "loss") {
    where.pnl = { lt: 0 };
  }

  if (filters?.startDate || filters?.endDate) {
    where.executedAt = {};

    if (filters.startDate) {
      where.executedAt.gte = new Date(filters.startDate);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      where.executedAt.lte = end;
    }
  } else if (account?.trackingStartDate) {
    where.executedAt = {
      gte: account.trackingStartDate,
    };
  }

  return prisma.trade.findMany({
    where,
    orderBy: {
      executedAt: "desc",
    },
  });
}
