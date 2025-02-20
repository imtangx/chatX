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

type LoginType = 'email' | 'account';

export default () => {
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
      const loginBackendUrl = 'http://localhost:3001/auth/login';
      const response = await axios.post(loginBackendUrl, apiPayload);
      console.log('登录成功，后端响应数据:', response.data);
      localStorage.setItem('username', values.username);
      localStorage.setItem('userId', response.data.user.id);
      message.success('登录成功！');

      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        message.error('登录失败，未收到Token！');
      }
    } catch (err) {
      console.error('登录失败，请求出错:', err);
      message.error('登录失败，请稍后重试！');
    }
  };

  // 如果存在token 跳转首页
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
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
          subTitle='轻量级的聊天应用'
          actions={
            <Space>
              <a style={{ color: 'rgb(204, 204, 204)' }}>其他登录方式</a>
              <GithubOutlined style={iconStyles} />
              <GoogleOutlined style={iconStyles} />
              <WeiboCircleOutlined style={iconStyles} />
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
                      placeholder={'用户名'}
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
              {
                key: 'email',
                label: '邮箱登录',
                children: loginType === 'email' && ( // children 属性用于放置 Tab 页的内容
                  <>
                    <ProFormText
                      fieldProps={{
                        size: 'large',
                        prefix: <MailOutlined className={'prefixIcon'} />,
                      }}
                      name='email'
                      placeholder={'邮箱账号'}
                      rules={[
                        {
                          required: true,
                          message: '请输入邮箱账号！',
                        },
                        {
                          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: '邮箱格式错误！',
                        },
                      ]}
                    />
                    <ProFormCaptcha
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      captchaProps={{
                        size: 'large',
                      }}
                      placeholder={'请输入验证码'}
                      captchaTextRender={(timing, count) => {
                        if (timing) {
                          return `${count} ${'获取验证码'}`;
                        }
                        return '获取验证码';
                      }}
                      name='captcha'
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ]}
                      onGetCaptcha={async () => {
                        message.success('获取验证码成功！验证码为：1234');
                      }}
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
