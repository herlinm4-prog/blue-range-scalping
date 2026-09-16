const DEFAULT_BASE_URL = process.env.PROJECTX_API_BASE_URL || 'https://api.topstepx.com';

export class ProjectXClient {
  constructor({ baseUrl = DEFAULT_BASE_URL, userName, apiKey, fetchImpl = fetch }) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.userName = userName;
    this.apiKey = apiKey;
    this.fetch = fetchImpl;
    this.token = null;
  }

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await this.fetch(`${this.baseUrl}${path}`, { ...options, headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body?.success === false) {
      const error = new Error(body?.errorMessage || body?.message || `ProjectX HTTP ${response.status}`);
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  }

  async post(path, payload) {
    return this.request(path, { method: 'POST', body: JSON.stringify(payload) });
  }

  async loginWithApiKey() {
    if (!this.userName || !this.apiKey) throw new Error('TOPSTEP_USERNAME and TOPSTEP_API_KEY are required');
    const body = await this.post('/api/Auth/loginKey', { userName: this.userName, apiKey: this.apiKey });
    if (!body?.token) throw new Error('ProjectX authentication returned no session token');
    this.token = body.token;
    return { success: true, tokenReceived: true };
  }

  async validateSession() { return this.post('/api/Auth/validate', {}); }
  async searchAccounts({ onlyActive = true } = {}) { return this.post('/api/Account/search', { onlyActiveAccounts: onlyActive }); }
  async searchOpenPositions(accountId) { return this.post('/api/Position/searchOpen', { accountId }); }
  async searchOpenOrders(accountId) { return this.post('/api/Order/searchOpen', { accountId }); }
  async searchContracts(searchText, live = false) { return this.post('/api/Contract/search', { searchText, live }); }
  async retrieveBars({ contractId, startTime, endTime, unit, unitNumber, limit = 500, includePartialBar = false, live = false }) {
    return this.post('/api/History/retrieveBars', { contractId, live, startTime, endTime, unit, unitNumber, limit, includePartialBar });
  }

  async discoverPracticeAccounts() {
    const response = await this.searchAccounts();
    const accounts = response?.accounts || [];
    return accounts.filter(account => `${account?.name || ''} ${account?.type || ''} ${account?.accountType || ''}`.toUpperCase().includes('PRACTICE'));
  }
}
