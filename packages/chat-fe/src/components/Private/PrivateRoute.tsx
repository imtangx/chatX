import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

interface PrivateRouteProps {
  children: React.ReactNode; // 允许传入子组件
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useUserStore.getState().token; // 检查 Token

  if (!isAuthenticated) {
    // 如果没有 Token，则跳转到登录页
    return <Navigate to='/auth/login' replace />;
  }

  // 如果有 Token，则渲染子组件 (HomePage)
  return children;
};

export default PrivateRoute;
