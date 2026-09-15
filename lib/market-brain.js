export const TIMEFRAMES = ['H1', 'M15', 'M5', 'M1'];
export const MARKET_STATES = ['TREND_UP', 'TREND_DOWN', 'RANGE', 'BREAKOUT_UP', 'BREAKOUT_DOWN', 'CHOP', 'WAITING'];
export const DECISIONS = ['BUY', 'SELL', 'NO_TRADE'];

export function decideMarketAction(states) {
  const h1 = states?.H1;
  const m15 = states?.M15;
  const m5 = states?.M5;
  const m1 = states?.M1;

  // Conservative v0.1 logic. This intentionally refuses ambiguous conditions.
  if ([h1, m15, m5, m1].some(v => !v)) return { decision: 'NO_TRADE', reason: 'INCOMPLETE_CONTEXT' };
  if ([h1, m15, m5].includes('CHOP') || m1 === 'CHOP') return { decision: 'NO_TRADE', reason: 'CHOP_FILTER' };
  if (h1 === 'RANGE' && ['RANGE', 'CHOP'].includes(m15)) return { decision: 'NO_TRADE', reason: 'HIGHER_TIMEFRAME_RANGE' };

  if (['TREND_UP','BREAKOUT_UP'].includes(h1) && ['TREND_UP','BREAKOUT_UP'].includes(m15) && ['TREND_UP','BREAKOUT_UP'].includes(m5) && ['TREND_UP','BREAKOUT_UP'].includes(m1)) {
    return { decision: 'BUY', reason: 'MULTI_TIMEFRAME_ALIGNMENT_UP' };
  }
  if (['TREND_DOWN','BREAKOUT_DOWN'].includes(h1) && ['TREND_DOWN','BREAKOUT_DOWN'].includes(m15) && ['TREND_DOWN','BREAKOUT_DOWN'].includes(m5) && ['TREND_DOWN','BREAKOUT_DOWN'].includes(m1)) {
    return { decision: 'SELL', reason: 'MULTI_TIMEFRAME_ALIGNMENT_DOWN' };
  }
  return { decision: 'NO_TRADE', reason: 'NO_CONFIRMED_ALIGNMENT' };
}
