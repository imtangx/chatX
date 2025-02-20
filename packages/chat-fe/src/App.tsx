import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/Private/PrivateRoute';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import './App.css';
import { DialogProvider } from './context/DialogContext';
import axios from 'axios';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; //  为所有请求自动添加 Authorization 头
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

function App() {
  const getInitIsDark = () => {
    const storedIsDark = localStorage.getItem('isDark');
    return storedIsDark ? JSON.parse(storedIsDark) === true : false;
  };
  const [isDark, setIsDark] = useState<boolean>(getInitIsDark()); // 在 App 组件中管理全局 isDark 状态
  const handleIsDarkToggle = () => {
    setIsDark(prevIsDark => {
      const newIsDark = !prevIsDark;
      localStorage.setItem('isDark', JSON.stringify(newIsDark));
      return newIsDark;
    });
  };

  return (
    <BrowserRouter>
      <AntdApp>
        <DialogProvider>
          <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
            {/* 使用 ConfigProvider 包裹 Routes，根据 isDark 切换主题 */}
            <button
              onClick={() => handleIsDarkToggle()}
              style={{
                background: isDark ? 'rgb(50, 50, 50)' : 'rgb(220, 220, 220)',
                position: 'fixed',
                top: 15,
                right: 15,
                zIndex: 1000,
              }}
            >
              {isDark ? '🌒' : '🌖'}
            </button>
            <Routes>
              <Route path='/auth/login' element={<LoginPage />} />
              <Route path='/auth/register' element={<RegisterPage />} />
              <Route
                path='/'
                element={
                  <PrivateRoute>
                    {' '}
                    {/** 路由守卫包裹HomePage组件 */}
                    <HomePage isDark={isDark} />
                  </PrivateRoute>
                }
              />
            </Routes>
          </ConfigProvider>
        </DialogProvider>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
