import { GithubAuthService } from './auth.js';
import { GithubApiService } from './api.js';

export class GithubLogin {
  constructor(config) {
    if (!config.clientId || !config.clientSecret || !config.callbackUrl || !config.scope) {
      throw new Error('Missing required configuration');
    }
    this.authService = new GithubAuthService(config);
    this.apiService = new GithubApiService();
  }

  getAuthUrl(){
    return this.authService.getAuthorizeUrl();
  }

  async handleCallback(authCode) {
    try {
      const authResponse = await this.authService.getAccessToken(authCode);
      const userInfo = await this.apiService.getUserInfo(authResponse.access_token);

      return {
        success: true,
        data: {
          userInfo,
          token: authResponse.access_token,
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
