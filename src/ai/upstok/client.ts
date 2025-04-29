export class UpstoxClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.UPSTOX_CLIENT_ID!;
    this.clientSecret = process.env.UPSTOX_CLIENT_SECRET!;
    this.redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/upstok`;
    this.baseUrl = 'https://api.upstox.com/v2';
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

    try {
      const tokenUrl = `${this.baseUrl}/login/authorization/token`;
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`Token fetch failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  }
}
