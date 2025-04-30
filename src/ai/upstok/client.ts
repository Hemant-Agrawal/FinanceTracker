export class UpstoxClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private baseUrl: string;
  private baseUrlV3: string;

  constructor() {
    this.clientId = process.env.UPSTOX_CLIENT_ID!;
    this.clientSecret = process.env.UPSTOX_CLIENT_SECRET!;
    this.redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/upstok`;
    this.baseUrl = 'https://api.upstox.com/v2';
    this.baseUrlV3 = 'https://api.upstox.com/v3';
  }

  async makeRequest(url: string, options: RequestInit, accessToken?: string) {
    const optionsWithAuth = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url, optionsWithAuth);
    if (response.ok) {
      return response.json();
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error(`Request failed: ${response.status}`);
  }

  async getAuthUrl(userId: string) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: userId,
    });
    return `${this.baseUrl}/login/authorization/dialog?${params.toString()}`;
  }

  async getAccessToken(authCode: string) {
    const body = new URLSearchParams({
      code: authCode,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    });

    return this.makeRequest(`${this.baseUrl}/login/authorization/token`, { method: 'POST', body: body.toString() });
  }

  async getTradeHistory(accessToken: string) {
    const params = new URLSearchParams({
      start_date: '2023-04-01',
      end_date: '2025-12-31',
      page_number: '1',
      page_size: '5000',
    });
    return this.makeRequest(`${this.baseUrl}/charges/historical-trades?${params.toString()}`, {}, accessToken);
  }

  async getHoldings(accessToken: string) {
    return this.makeRequest(`${this.baseUrl}/portfolio/long-term-holdings`, {}, accessToken);
  }

  async getPositions(accessToken: string) {
    return this.makeRequest(`${this.baseUrl}/portfolio/short-term-holdings`, {}, accessToken);
  }

  async getOrderDetails(accessToken: string) {
    return this.makeRequest(`${this.baseUrl}/orders/details`, {}, accessToken);
  }

  async getOrderHistory(accessToken: string) {
    return this.makeRequest(`${this.baseUrl}/orders/history`, {}, accessToken);
  }

  async getOrderBook(accessToken: string) {
    return this.makeRequest(`${this.baseUrl}/orders/book`, {}, accessToken);
  }
}
