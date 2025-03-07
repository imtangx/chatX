import {
  LockOutlined,
  UserOutlined,
  WeiboCircleOutlined,
  GithubOutlined,
  GoogleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { Space, Tabs, theme, App } from 'antd';
import type { CSSProperties } from 'react';
import React, { useState, useEffect } from 'react';
import logoSvg from '../assets/logo.svg';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { config } from '../config';

type LoginType = 'email' | 'account';

export default () => {
  const { setUser, setToken } = useUserStore();
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>('account');

  const navigate = useNavigate();

  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  const handleFormFinish = async (values: any) => {
    console.log('表单提交的数据：', values);
    let apiPayload = {};
    if (loginType === 'account') {
      apiPayload = {
        username: values.username,
        password: values.password,
      };
    } else if (loginType === 'email') {
    }

    try {
      const loginBackendUrl = `${config.API_URL}/auth/login`;
      const response = await axios.post(loginBackendUrl, apiPayload);
      console.log('登录成功，后端响应数据:', response.data);
      const { user, token } = response.data;
      setUser(user);
      // setTokens({ token, refreshToken });
      setToken(token);
      message.success('登录成功！');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('登录失败，请求出错:', err);
      message.error('登录失败，请稍后重试！');
    }
  };

  const handleGithubLogin = () => {
    window.location.href = `${config.API_URL}/auth/github`;
  };

  const handleGoogleLogin = () => {
    console.log(config.API_URL);
    window.location.href = `${config.API_URL}/auth/google`;
  };

  useEffect(() => {
    const sendHash = async () => {
      const fragment = window.location.hash.substring(1);
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        if (accessToken) {
          // TODO 把token传到后端google回调函数 在后端拿到name 然后注册登录
          console.log('后端处理：', `${config.API_URL}/auth/google/callback`);
          try {
            const response = await axios.get(`${config.API_URL}/auth/google/callback?access_token=${accessToken}`);
            console.log('Google登录成功，后端响应数据:', response.data);
            window.location.href = response.data.redirect;
          } catch (err) {
            console.error('Google登录失败，请求出错：', err);
          }
        }
      }
    };

    sendHash();
  }, []);

  // 如果存在token 跳转首页
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, []);

  return (
    <ProConfigProvider hashed={false}>
      <style>{`
        .ant-pro-form-login-title {
          color: black;
        }
      `}</style>
      <div style={{ backgroundColor: token.colorBgContainer, height: '100vh' }}>
        <LoginForm
          logo={logoSvg}
          title='chatX'
          subTitle='一个实时、便捷的聊天应用'
          actions={
            <Space>
              <a style={{ color: 'rgb(204, 204, 204)' }}>其他登录方式</a>
              <GithubOutlined style={iconStyles} onClick={handleGithubLogin} />
              <GoogleOutlined style={iconStyles} onClick={handleGoogleLogin} />
              {/* <WeiboCircleOutlined style={iconStyles} /> */}
            </Space>
          }
          onFinish={handleFormFinish}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={activeKey => setLoginType(activeKey as LoginType)}
            items={[
              // 使用 items 属性配置 Tab 页项
              {
                key: 'account',
                label: '账号密码登录',
                children: loginType === 'account' && ( // children 属性用于放置 Tab 页的内容
                  <>
                    <ProFormText
                      name='username'
                      validateTrigger='onBlur'
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'用户名 / 邮箱账号'}
                      rules={[
                        {
                          required: true,
                          message: '请输入用户名!',
                        },
                        {
                          min: 2,
                          message: '用户名长度至少为 2 位！',
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name='password'
                      validateTrigger='onBlur'
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'密码'}
                      rules={[
                        {
                          required: true,
                          message: '请输入密码！',
                        },
                        {
                          min: 6,
                          message: '密码长度至少为 6 位！',
                        },
                      ]}
                    />
                  </>
                ),
              },
            ]}
          />

          <div style={{ marginBlockEnd: 12, textAlign: 'right' }}>
            <Link to='/auth/register'>还没有账号？立即注册</Link>
          </div>

          {/* <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <>
              <ProFormCheckbox noStyle name='autoLogin'>
                自动登录
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </>
          </div> */}
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
