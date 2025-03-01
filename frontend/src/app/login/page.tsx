'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/lib/api';

interface LoginResponse {
  token: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response: LoginResponse = await loginUser({ email, password });
      const { token } = response;

      localStorage.setItem('token', token);
      router.push('/');
    } catch (error) {
      let errorMessage = 'Đăng nhập thất bại';

      if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        errorMessage = apiError.response?.data?.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error('Login error:', error);
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="login-form">
        <h1>Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên người dùng"
              value={email} // Sử dụng email state cho trường này (có thể tách thành username nếu cần)
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <a href="/forgot-password" className="forgot-password">
            Quên mật khẩu
          </a>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #ffffff;
          padding: 20px;
        }

        .login-form {
          background-color: #e0e0e0;
          padding: 30px;
          border-radius: 5px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: #000000;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #000000;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }

        .forgot-password {
          display: block;
          text-align: right;
          color: #000000;
          text-decoration: none;
          margin-bottom: 15px;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background-color: #333333;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .login-button:hover {
          background-color: #555555;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;