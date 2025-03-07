import axios from 'axios';
import { GOOGLE_ENDPOINTS } from './constant.js';

export class GoogleAuthService {
  constructor(config) {
    this.config = config;
  }

  getAuthorizeUrl() {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.callbackUrl,
      scope: this.config.scope.join(' '),
      response_type: 'token',
    });

    console.log(this.config.callbackUrl);
    return `${GOOGLE_ENDPOINTS.AUTHORIZE}?${params.toString()}`;
  }

  getAccessToken(url) {
    const fragment = url.split('#')[1];
    const params = new URLSearchParams(fragment);
    const access_token = params.get('access_token');
    if (access_token) {
      return access_token;
    }

    throw new Error('can not find the accesstoken from callback url');
  }
}
