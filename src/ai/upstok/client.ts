async function makeRequest(url: string, options: RequestInit, accessToken?: string) {
  const optionsWithAuth = {
    ...options,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  const response = await fetch(url, optionsWithAuth);
  if (response.ok) {
    return response.json();
  }
  if (response.status >= 400) {
    const data = await response.json();
    console.log(url, data, optionsWithAuth);
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Bad Request');
  }
  throw new Error(`Request failed: ${response.status}`);
}

const baseUrl = 'https://api.upstox.com/v2';
const baseUrlV3 = 'https://api.upstox.com/v3';

export class UpstoxClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.UPSTOX_CLIENT_ID!;
    this.clientSecret = process.env.UPSTOX_CLIENT_SECRET!;
    // this.redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/upstok`;
    this.redirectUri = `https://finance-tracker-orpin-rho.vercel.app/auth/upstok`;
  }


  static async makeAccessTokenRequest(clientId: string) {
    return makeRequest(`${baseUrlV3}/login/auth/token/${clientId}`, { method: 'POST' });
  }

  async getAuthUrl(userId: string) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: userId,
    });
    return `${baseUrl}/login/authorization/dialog?${params.toString()}`;
  }

  async getAccessToken(authCode: string) {
    const body = new URLSearchParams({
      code: authCode,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    });

    return makeRequest(`${baseUrl}/login/authorization/token`, {
      method: 'POST',
      body: body.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  static async getTradeHistory(accessToken: string) {
    const params = new URLSearchParams({
      start_date: '2023-04-01',
      end_date: '2025-12-31',
      page_number: '1',
      page_size: '5000',
    });
    return makeRequest(`${baseUrl}/charges/historical-trades?${params.toString()}`, {}, accessToken);
  }

  static async getHoldings(accessToken: string) {
    return makeRequest(`${baseUrl}/portfolio/long-term-holdings`, {}, accessToken);
  }

  static async getPositions(accessToken: string) {
    return makeRequest(`${baseUrl}/portfolio/short-term-holdings`, {}, accessToken);
  }

  static async getOrderDetails(accessToken: string) {
    return makeRequest(`${baseUrl}/orders/details`, {}, accessToken);
  }

  static async getOrderHistory(accessToken: string) {
    return makeRequest(`${baseUrl}/orders/history`, {}, accessToken);
  }

  static async getOrderBook(accessToken: string) {
    return makeRequest(`${baseUrl}/orders/book`, {}, accessToken);
  }
}
