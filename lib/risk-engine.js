export const DEFAULT_RISK_SETTINGS = Object.freeze({
  profitLockEnabled: true,
  triggerProfitUsd: 100,
  lockPercent: 50,
  autoTradingDefault: false,
});

/**
 * Pure calculation only. The broker adapter remains responsible for validating
 * tick size, side, current market, order state and whether a stop modification
 * is accepted by the execution venue.
 */
export function calculateLockedProfit(triggerProfitUsd, lockPercent) {
  const trigger = Number(triggerProfitUsd);
  const percent = Number(lockPercent);
  if (!Number.isFinite(trigger) || trigger <= 0) throw new Error('triggerProfitUsd must be > 0');
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) throw new Error('lockPercent must be between 0 and 100');
  return trigger * (percent / 100);
}

export function shouldActivateProfitLock(openProfitUsd, settings = DEFAULT_RISK_SETTINGS) {
  return Boolean(settings.profitLockEnabled) && Number(openProfitUsd) >= Number(settings.triggerProfitUsd);
}

export function evaluateRiskGate({ killSwitch, autoTrading, signal, dailyLossLimitHit = false }) {
  if (killSwitch) return { allowed: false, reason: 'KILL_SWITCH' };
  if (!autoTrading) return { allowed: false, reason: 'AUTO_OFF' };
  if (dailyLossLimitHit) return { allowed: false, reason: 'DAILY_LOSS_LIMIT' };
  if (!signal || signal === 'NO_TRADE') return { allowed: false, reason: 'NO_SIGNAL' };
  return { allowed: true, reason: 'RISK_GATE_PASSED' };
}
