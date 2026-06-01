-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "broker" TEXT NOT NULL DEFAULT 'Tradovate',
    "provider" TEXT NOT NULL DEFAULT 'Lucid',
    "startingBalance" DECIMAL(12,2) NOT NULL,
    "payoutTarget" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "maxDrawdown" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "consistencyThreshold" DECIMAL(5,2) NOT NULL DEFAULT 30,
    "dailyLossLimit" DECIMAL(12,2),
    "profitShare" DECIMAL(5,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT,
    "quantity" INTEGER,
    "price" DECIMAL(12,4),
    "executedAt" TIMESTAMP(3) NOT NULL,
    "pnl" DECIMAL(12,2) NOT NULL,
    "fees" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "commission" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "orderId" TEXT,
    "sourceAccount" TEXT,
    "setupTag" TEXT,
    "mistakeTag" TEXT,
    "notes" TEXT,
    "screenshotUrl" TEXT,
    "rawRow" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trade_accountId_executedAt_idx" ON "Trade"("accountId", "executedAt");

-- CreateIndex
CREATE INDEX "Trade_accountId_symbol_idx" ON "Trade"("accountId", "symbol");

-- CreateIndex
CREATE INDEX "Trade_accountId_setupTag_idx" ON "Trade"("accountId", "setupTag");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
