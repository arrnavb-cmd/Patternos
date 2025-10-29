const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class PatternOSAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.token = response.access_token;
    localStorage.setItem('access_token', response.access_token);
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.token = response.access_token;
    localStorage.setItem('access_token', response.access_token);
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Behavioral Intelligence
  async getIntentSignals(timeframe = '24h') {
    return this.request(`/behavioral/intent-signals?timeframe=${timeframe}`);
  }

  // Campaigns
  async listCampaigns() {
    return this.request('/campaigns/list');
  }

  async getCampaignPerformance(campaignId, timeframe = '7d') {
    return this.request(`/campaigns/${campaignId}/performance?timeframe=${timeframe}`);
  }
}

export default new PatternOSAPI();
