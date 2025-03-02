import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { Space, Tabs, theme, Form, App } from 'antd';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import logoSvg from '../assets/logo.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

export default () => {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  const handleFormFinish = async (values: any) => {
    console.log('表单提交的数据：', values);

    try {
      const response = await axios.post(`${config.API_URL}/auth/email/verify`, {
        email: values.email,
        code: values.captcha,
      });
      const { success } = response.data.response;
      if (success === true) {
        console.log('验证验证码成功');
      } else {
        console.log('验证验证码失败');
        message.error('验证验证码失败，请稍后重试');
        return;
      }
    } catch (err) {
      console.error('验证验证码失败，请求出错:', err);
      message.error('验证验证码失败，请稍后重试');
      return;
    }

    let apiPayload = {
      username: values.username,
      password: values.password,
      email: values.email,
    };
    try {
      const registerBackendUrl = `${config.API_URL}/auth/register`;
      const response = await axios.post(registerBackendUrl, apiPayload);
      console.log('注册成功，后端响应数据:', response.data);
      message.success('注册成功，请前往登录！');

      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    } catch (err: any) {
      console.error('注册失败，请求出错:', err);
      message.error(err.response.data.message);
    }
  };

  const handleGetCaptcha = async () => {
    try {
      const response = await axios.post(`${config.API_URL}/auth/email/code`, {
        email: form.getFieldValue('email'),
      });
      console.log('获取验证码成功，后端响应数据:', response.data);
      message.success('验证码已发送，请查收！');
    } catch (err) {
      console.error('获取验证码失败，请求出错:', err);
    }
  };

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
          onFinish={handleFormFinish}
          form={form}
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
        >
          <Tabs
            centered
            items={[
              // 使用 items 属性配置 Tab 页项
              {
                key: 'account',
                label: '注册新账户',
                // children 属性用于放置 Tab 页的内容
                children: (
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
                        onGetCaptcha={handleGetCaptcha}
                      />
                    </>
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
                    <ProFormText.Password
                      name='confirmPassword'
                      validateTrigger='onBlur'
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'确认密码'}
                      rules={[
                        {
                          required: true,
                          message: '请再次输入密码！',
                        },
                        // 自定义验证规则 确认密码
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次输入的密码不一致！'));
                          },
                        }),
                      ]}
                    />
                  </>
                ),
              },
            ]}
          />
          <div
            style={{
              marginBlockEnd: 24,
            }}
          ></div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
