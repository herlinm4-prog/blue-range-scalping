export class SyncEngine {
  constructor(client) { this.client = client; }

  async snapshot(accountId) {
    const [positionsResponse, ordersResponse] = await Promise.all([
      this.client.searchOpenPositions(accountId),
      this.client.searchOpenOrders(accountId),
    ]);
    return {
      accountId,
      positions: positionsResponse?.positions || [],
      orders: ordersResponse?.orders || [],
      timestamp: new Date().toISOString(),
    };
  }

  async findActiveNqContract() {
    const response = await this.client.searchContracts('NQ', false);
    const contracts = response?.contracts || [];
    const nq = contracts.find(c => c.activeContract && (c.symbolId === 'F.US.ENQ' || /^NQ/i.test(c.name || '')));
    if (!nq) throw new Error('Active NQ contract not found in simulated market-data subscription');
    return nq;
  }

  assertPractice(account) {
    const name = `${account?.name || ''}`.toUpperCase();
    if (!name.includes('PRACTICE')) throw new Error('Safety lock: selected account is not explicitly named PRACTICE');
    if (account?.canTrade === false) throw new Error('Safety lock: PRACTICE account cannot trade');
    return true;
  }
}
