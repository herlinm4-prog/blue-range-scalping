export const BOT_STATES = Object.freeze([
  'SCANNING',
  'OPPORTUNITY',
  'VALIDATING',
  'ARMED',
  'IN_TRADE',
  'PROTECTING',
  'EXIT',
  'LEARNING',
  'COOLDOWN',
  'HALTED',
]);

export function nextBotState({ current = 'SCANNING', opportunity = false, validated = false, riskApproved = false, positionOpen = false, profitLockActive = false, positionClosed = false, cooldown = false, killed = false }) {
  if (killed) return 'HALTED';
  if (cooldown) return 'COOLDOWN';
  if (positionOpen && profitLockActive) return 'PROTECTING';
  if (positionOpen) return 'IN_TRADE';
  if (positionClosed && current === 'EXIT') return 'LEARNING';
  if (positionClosed) return 'EXIT';
  if (validated && riskApproved) return 'ARMED';
  if (opportunity && validated) return 'VALIDATING';
  if (opportunity) return 'OPPORTUNITY';
  return 'SCANNING';
}
