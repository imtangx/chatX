import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import './App.css';

// 创建主题包装组件
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      {/* 主题切换按钮 */}
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          background: isDark ? 'rgb(50, 50, 50)' : 'rgb(220, 220, 220)',
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        {isDark ? '🌞' : '🌙'}
      </button>
      {children}
    </ConfigProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AntdApp>
        <Routes>
          {/* 需要全局黑暗模式的页面 */}
          <Route
            path='/auth/login'
            element={
              <ThemeWrapper>
                <LoginPage />
              </ThemeWrapper>
            }
          />
          <Route
            path='/auth/register'
            element={
              <ThemeWrapper>
                <RegisterPage />
              </ThemeWrapper>
            }
          />

          {/* 自定义黑暗模式的页面 */}
          <Route path='/' element={<HomePage />} />
        </Routes>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
