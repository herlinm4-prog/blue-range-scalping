export const DEFAULT_COMBINE_50K = Object.freeze({
  accountType: 'COMBINE',
  nominalSizeUsd: 50000,
  profitTargetUsd: 3000,
  maxLossLimitUsd: 2000,
  maxMiniContracts: 5,
  maxMicroContracts: 50,
  consistencyTargetPercent: 55,
});

export function missionProgress({ realizedProfitUsd = 0, targetUsd = 3000 }) {
  const progress = Math.max(0, Number(realizedProfitUsd));
  const target = Math.max(1, Number(targetUsd));
  return {
    progressUsd: progress,
    remainingUsd: Math.max(0, target - progress),
    completionPercent: Math.min(100, (progress / target) * 100),
  };
}

export function consistencyPercent({ bestDayProfitUsd = 0, totalProfitUsd = 0 }) {
  if (totalProfitUsd <= 0) return 0;
  return Math.max(0, (Number(bestDayProfitUsd) / Number(totalProfitUsd)) * 100);
}

export function accountRuleGuard({ requestedContracts = 0, contractType = 'MINI', maxMiniContracts = 5, maxMicroContracts = 50, accountLocked = false, maxLossLimitHit = false }) {
  if (accountLocked) return { allowed: false, reason: 'ACCOUNT_LOCKED' };
  if (maxLossLimitHit) return { allowed: false, reason: 'MAX_LOSS_LIMIT' };
  const max = contractType === 'MICRO' ? maxMicroContracts : maxMiniContracts;
  if (requestedContracts < 1) return { allowed: false, reason: 'INVALID_SIZE' };
  if (requestedContracts > max) return { allowed: false, reason: 'CONTRACT_LIMIT', allowedContracts: max };
  return { allowed: true, reason: 'ACCOUNT_RULES_PASSED', allowedContracts: requestedContracts };
}
