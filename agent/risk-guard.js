export const DEFAULT_RISK = Object.freeze({
  maxContracts: 1,
  maxOpenPositions: 0,
  maxOpenOrders: 0,
  minConfidence: 45,
  dailyLossLimitUsd: 150,
  profitLockTriggerUsd: 100,
  profitLockPercent: 50,
});

export function evaluateRisk({ account, snapshot, decision, sessionPnl = 0, config = DEFAULT_RISK }) {
  const blocks = [];
  if (!account?.name?.toUpperCase().includes('PRACTICE')) blocks.push('NOT_PRACTICE');
  if (account?.canTrade === false) blocks.push('ACCOUNT_CANNOT_TRADE');
  if ((snapshot?.positions?.length || 0) > config.maxOpenPositions) blocks.push('POSITION_ALREADY_OPEN');
  if ((snapshot?.orders?.length || 0) > config.maxOpenOrders) blocks.push('WORKING_ORDER_EXISTS');
  if (sessionPnl <= -Math.abs(config.dailyLossLimitUsd)) blocks.push('DAILY_LOSS_LIMIT');
  if (!['BUY_SETUP','SELL_SETUP'].includes(decision?.action)) blocks.push('NO_VALID_SETUP');
  if ((decision?.avgConfidence || 0) < config.minConfidence) blocks.push('CONFIDENCE_TOO_LOW');
  return { approved: blocks.length === 0, blocks, maxContracts: config.maxContracts };
}

export function calculateProfitLock(openProfitUsd, config = DEFAULT_RISK) {
  if (openProfitUsd < config.profitLockTriggerUsd) return { active: false, protectedUsd: 0 };
  return { active: true, protectedUsd: openProfitUsd * (config.profitLockPercent / 100) };
}
