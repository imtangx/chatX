import { GoogleAuthService } from './auth.js';
import { GoogleApiService } from './api.js';

export class GoogleLogin {
  constructor(config) {
    if (!config.clientId || !config.clientSecret || !config.callbackUrl || !config.scope) {
      throw new Error('Missing required configuration');
    }
    this.authService = new GoogleAuthService(config);
    this.apiService = new GoogleApiService();
  }

  getAuthUrl() {
    return this.authService.getAuthorizeUrl();
  }

  async handleCallback(callbackUrl) {
    try {
      const access_token = this.authService.getAccessToken(callbackUrl);
      const userInfo = this.apiService.getUserInfo(access_token);

      return {
        success: true,
        data: {
          userInfo,
          token: access_token,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
