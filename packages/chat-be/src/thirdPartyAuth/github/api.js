import axios from 'axios';
import { GITHUB_ENDPOINTS } from './constant.js';

export class GithubApiService {
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(GITHUB_ENDPOINTS.USER, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }
}
