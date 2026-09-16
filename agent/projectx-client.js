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

  async loginWithApiKey() {
    if (!this.userName || !this.apiKey) throw new Error('TOPSTEP_USERNAME and TOPSTEP_API_KEY are required');
    const body = await this.request('/api/Auth/loginKey', {
      method: 'POST',
      body: JSON.stringify({ userName: this.userName, apiKey: this.apiKey }),
    });
    if (!body?.token) throw new Error('ProjectX authentication returned no session token');
    this.token = body.token;
    return { success: true, tokenReceived: true };
  }

  async validateSession() {
    return this.request('/api/Auth/validate', { method: 'POST', body: '{}' });
  }

  async searchAccounts({ onlyActive = true } = {}) {
    return this.request('/api/Account/search', {
      method: 'POST',
      body: JSON.stringify({ onlyActiveAccounts: onlyActive }),
    });
  }

  async discoverPracticeAccounts() {
    const response = await this.searchAccounts();
    const accounts = response?.accounts || [];
    return accounts.filter(account => {
      const text = `${account?.name || ''} ${account?.type || ''} ${account?.accountType || ''}`.toUpperCase();
      return text.includes('PRACTICE');
    });
  }
}
