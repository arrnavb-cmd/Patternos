const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3025/api/v1';
const USE_MOCK = true; // Set to false when Railway works

class PatternOSAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  async request(endpoint, options = {}) {
    // MOCK MODE - Return fake data immediately
    if (USE_MOCK) {
      return this.mockRequest(endpoint, options);
    }

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

  mockRequest(endpoint, options) {
    // Mock responses
    if (endpoint === '/auth/login') {
      const body = JSON.parse(options.body);
      if (body.email === 'demo@patternos.ai' && body.password === 'demo123') {
        return Promise.resolve({
          access_token: 'mock_token_123',
          refresh_token: 'mock_refresh_456',
          token_type: 'bearer',
          user: {
            id: 'usr_001',
            email: body.email,
            company_name: 'Demo Company',
            role: 'advertiser'
          }
        });
      }
      return Promise.reject(new Error('Invalid credentials'));
    }

    if (endpoint === '/auth/register') {
      const body = JSON.parse(options.body);
      return Promise.resolve({
        access_token: 'mock_token_123',
        refresh_token: 'mock_refresh_456',
        token_type: 'bearer',
        user: {
          id: 'usr_002',
          email: body.email,
          company_name: body.company_name,
          role: body.role
        }
      });
    }

    return Promise.resolve({ status: 'ok' });
  }

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

  async getIntentSignals(timeframe = '24h') {
    return this.request(`/behavioral/intent-signals?timeframe=${timeframe}`);
  }

  async listCampaigns() {
    return this.request('/campaigns/list');
  }

  async getCampaignPerformance(campaignId, timeframe = '7d') {
    return this.request(`/campaigns/${campaignId}/performance?timeframe=${timeframe}`);
  }
}

export default new PatternOSAPI();
