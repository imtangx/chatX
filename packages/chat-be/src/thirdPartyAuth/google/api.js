import axios from 'axios';
import { GOOGLE_ENDPOINTS } from './constant.js';

export class GoogleApiService {
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(GOOGLE_ENDPOINTS.USER, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          personFields: 'names,emailAddresses,photos', // 指定需要的字段
        },
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }
}
