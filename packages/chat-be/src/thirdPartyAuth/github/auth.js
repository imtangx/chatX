import axios from 'axios';
import { GITHUB_ENDPOINTS } from './constant.js';

export class GithubAuthService {
  constructor(config) {
    this.config = config;
  }

  getAuthorizeUrl() {
    console.log(this.config.callbackUrl);
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.callbackUrl,
      scope: this.config.scope.join(' '),
      response_type: 'code',
    });
    return `${GITHUB_ENDPOINTS.AUTHORIZE}?${params.toString()}`;
  }

  async getAccessToken(authCode) {
    try {
      const response = await axios.post(
        GITHUB_ENDPOINTS.ACCESS_TOKEN,
        {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code: authCode,
          redirect_uri: this.config.callbackUrl,
        },
        {
          headers: {
            Accept: 'application/json',
          },
          timeout: 15000,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }
}
