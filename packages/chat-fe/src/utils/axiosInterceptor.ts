import axios, { AxiosRequestConfig } from 'axios';

// 定义等待队列中Promise的类型
interface QueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}

// 用于存储是否正在刷新token的状态
let isRefreshing = false;
// 存储因等待token刷新而挂起的请求队列
let failedQueue: QueueItem[] = [];

/**
 * 处理等待队列中的请求
 * @param error - 如果token刷新失败，传入错误对象
 * @param token - 如果token刷新成功，传入新的token
 */
const processQueue = (error: any, token: string | null = null) => {
  // 处理队列中的每个请求
  failedQueue.forEach(prom => {
    if (error) {
      // 如果刷新失败，拒绝所有等待的请求
      prom.reject(error);
    } else {
      // 如果刷新成功，解决所有等待的请求
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * 登出处理函数
 */
const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  window.location.href = '/auth/login';
};

/**
 * 设置请求拦截器
 */
const setupRequestInterceptor = () => {
  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

/**
 * 设置响应拦截器
 */
const setupResponseInterceptor = () => {
  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // 处理401错误（未授权）
      if (error.response?.status === 401) {
        // 如果是刷新token的请求返回401，说明refresh token已过期 否则是token过期
        if (originalRequest.url === 'http://localhost:3001/auth/refresh') {
          console.log('Refresh token 已过期');
          handleLogout();
          return Promise.reject(error);
        }

        // 确保同一个请求不会重试多次
        if (!originalRequest._retry) {
          // 如果已经在刷新token，则将请求加入等待队列
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(token => {
                // 用新token更新请求头
                originalRequest.headers!['Authorization'] = `Bearer ${token}`;
                // 重试请求
                return axios(originalRequest);
              })
              .catch(err => Promise.reject(err));
          }

          // 标记该请求正在重试
          originalRequest._retry = true;
          isRefreshing = true;

          // 获取refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            console.log('没有 refresh token');
            handleLogout();
            return Promise.reject(error);
          }

          try {
            // 尝试刷新token
            const response = await axios.post('http://localhost:3001/auth/refresh', {
              refreshToken: refreshToken,
            });

            // 保存新的access token
            const newToken = response.data.token;
            localStorage.setItem('authToken', newToken);

            // 更新当前请求的token
            originalRequest.headers!['Authorization'] = `Bearer ${newToken}`;

            // 处理队列中的请求
            processQueue(null, newToken);
            isRefreshing = false;

            // 重试当前请求
            return axios(originalRequest);
          } catch (err) {
            // 刷新token失败
            processQueue(err, null);
            isRefreshing = false;
            handleLogout();
            return Promise.reject(err);
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

/**
 * 初始化所有拦截器
 */
export const setupAxiosInterceptors = () => {
  setupRequestInterceptor();
  setupResponseInterceptor();
};
