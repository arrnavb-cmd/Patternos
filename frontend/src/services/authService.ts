interface User {
  email: string;
  role: 'aggregator' | 'brand';
  brand: string | null;
  name: string;
  sessionId: string;
  expiresAt: number;
}

const SESSION_KEY = 'patternos_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class AuthService {
  private static generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static login(email: string, password: string): User | null {
    // Validate credentials
    const users: Record<string, any> = {
      'admin@zepto.com': { role: 'aggregator', brand: null, name: 'Zepto Admin' },
      'hul@zepto.com': { role: 'brand', brand: 'HUL', name: 'HUL Marketing' },
      'nike@zepto.com': { role: 'brand', brand: 'Nike', name: 'Nike India' },
      'pg@zepto.com': { role: 'brand', brand: 'P&G', name: 'P&G Marketing' },
      'boat@zepto.com': { role: 'brand', brand: 'boAt', name: 'boAt Team' },
    };

    // STRICT password check
    if (password !== 'demo123') {
      console.error('❌ Invalid password');
      return null;
    }

    const userConfig = users[email];
    if (!userConfig) {
      console.error('❌ Invalid email');
      return null;
    }

    // Create session
    const session: User = {
      email,
      role: userConfig.role,
      brand: userConfig.brand,
      name: userConfig.name,
      sessionId: this.generateSessionId(),
      expiresAt: Date.now() + SESSION_DURATION,
    };

    // Save to localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    console.log('✅ Session created:', session.sessionId);
    
    return session;
  }

  static getSession(): User | null {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) {
        console.log('⚠️ No session found');
        return null;
      }

      const session: User = JSON.parse(stored);

      // Check expiry
      if (Date.now() > session.expiresAt) {
        console.log('⏰ Session expired');
        this.logout();
        return null;
      }

      console.log('✅ Valid session:', session.email, session.role);
      return session;
    } catch (e) {
      console.error('❌ Session parse error:', e);
      this.logout();
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(SESSION_KEY);
    console.log('👋 Session cleared');
  }

  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  static isAggregator(): boolean {
    const session = this.getSession();
    return session?.role === 'aggregator';
  }

  static isBrand(): boolean {
    const session = this.getSession();
    return session?.role === 'brand';
  }

  static getBrandName(): string | null {
    const session = this.getSession();
    return session?.brand || null;
  }
}
