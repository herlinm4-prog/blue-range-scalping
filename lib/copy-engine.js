export function scaleFollowerOrder(masterOrder, follower) {
  if (!masterOrder || !follower) return { allowed: false, reason: 'MISSING_DATA' };
  if (!follower.enabled) return { allowed: false, reason: 'FOLLOWER_DISABLED' };
  if (follower.accountLocked) return { allowed: false, reason: 'FOLLOWER_LOCKED' };

  const ratio = Math.max(0, Number(follower.sizeRatio ?? 1));
  const requested = Math.max(0, Math.floor(Number(masterOrder.contracts) * ratio));
  const maxContracts = Math.max(0, Number(follower.maxContracts ?? requested));
  const contracts = Math.min(requested, maxContracts);

  if (contracts < 1) return { allowed: false, reason: 'FOLLOWER_SIZE_ZERO' };
  return {
    allowed: true,
    reason: 'FOLLOWER_GUARD_PASSED',
    order: { ...masterOrder, contracts, source: 'MASTER_COPY' },
  };
}

export function buildCopyPlan(masterOrder, followers = []) {
  return followers.map(follower => ({
    followerId: follower.id,
    ...scaleFollowerOrder(masterOrder, follower),
  }));
}
