export function createObservation({ timestamp = new Date().toISOString(), symbol = 'NQ', marketState, timeframeStates, decision, setup, entry = null, stop = null, target = null, executed = false }) {
  return {
    timestamp,
    symbol,
    marketState,
    timeframeStates,
    decision,
    setup,
    planned: { entry, stop, target },
    executed,
    outcome: null,
    mfeUsd: null,
    maeUsd: null,
    exitReason: null,
  };
}

export function closeObservation(observation, { pnlUsd = 0, mfeUsd = 0, maeUsd = 0, exitReason = 'UNKNOWN' }) {
  return {
    ...observation,
    outcome: Number(pnlUsd),
    mfeUsd: Number(mfeUsd),
    maeUsd: Number(maeUsd),
    exitReason,
  };
}

// NO_TRADE observations are intentionally retained so later analysis can test
// whether rejected opportunities would have succeeded or failed.
export function isCounterfactualCandidate(observation) {
  return observation?.decision === 'NO_TRADE' && observation?.executed === false;
}
