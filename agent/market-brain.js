function ema(values, period) {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  let value = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (const price of values.slice(period)) value = price * k + value * (1 - k);
  return value;
}

function range(bar) { return Math.max(0, Number(bar.h) - Number(bar.l)); }
function body(bar) { return Math.abs(Number(bar.c) - Number(bar.o)); }

export function analyzeTimeframe(bars) {
  if (!Array.isArray(bars) || bars.length < 25) return { ready: false, bias: 'NEUTRAL', confidence: 0 };
  const closes = bars.map(b => Number(b.c));
  const fast = ema(closes, 9);
  const slow = ema(closes, 21);
  const last = bars.at(-1);
  const recent = bars.slice(-10);
  const avgRange = recent.reduce((s, b) => s + range(b), 0) / recent.length;
  const lastBodyRatio = range(last) ? body(last) / range(last) : 0;
  const slope = closes.at(-1) - closes.at(-6);
  const trendUp = fast > slow && slope > 0;
  const trendDown = fast < slow && slope < 0;
  const bias = trendUp ? 'LONG' : trendDown ? 'SHORT' : 'NEUTRAL';
  const separation = slow ? Math.abs(fast - slow) / Math.abs(slow) : 0;
  const confidence = Math.min(100, Math.round(separation * 50000 + lastBodyRatio * 35));
  return { ready: true, bias, confidence, fast, slow, avgRange, last: Number(last.c) };
}

export function decide({ h1, m15, m5, m1 }) {
  const frames = { h1: analyzeTimeframe(h1), m15: analyzeTimeframe(m15), m5: analyzeTimeframe(m5), m1: analyzeTimeframe(m1) };
  if (Object.values(frames).some(f => !f.ready)) return { action: 'NO_TRADE', reason: 'INSUFFICIENT_DATA', frames };
  const direction = frames.h1.bias;
  if (direction === 'NEUTRAL') return { action: 'NO_TRADE', reason: 'H1_NEUTRAL', frames };
  const aligned = ['m15','m5','m1'].filter(k => frames[k].bias === direction).length;
  const avgConfidence = Object.values(frames).reduce((s, f) => s + f.confidence, 0) / 4;
  if (aligned < 3) return { action: 'HOLD', reason: 'TIMEFRAME_MISALIGNMENT', direction, avgConfidence, frames };
  if (avgConfidence < 45) return { action: 'HOLD', reason: 'LOW_CONFIDENCE', direction, avgConfidence, frames };
  return { action: direction === 'LONG' ? 'BUY_SETUP' : 'SELL_SETUP', reason: 'H1_M15_M5_M1_ALIGNED', direction, avgConfidence, frames };
}
