import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { App } from 'antd';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setTokens } = useUserStore();
  const { message } = App.useApp();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      message.error(error);
      navigate('/auth/login');
      return;
    }

    // 从URL参数中获取用户信息
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const avatar = searchParams.get('avatar');
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    console.log(searchParams);

    if (userId && username && token) {
      // 设置用户信息到 Zustand store
      setUser({
        userId: parseInt(userId),
        username,
        avatar: avatar || ''
      });
      
      // 设置token
      setTokens({
        token,
        refreshToken: refreshToken || ''
      });

      message.success('登录成功！');
      navigate('/');
    } else {
      message.error('登录失败，缺少必要信息');
      navigate('/auth/login');
    }
  }, [searchParams, setUser, setTokens, navigate, message]);

  return <div>正在处理登录信息...</div>;
};

export default AuthCallback; 