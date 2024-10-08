"use client";  

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); 
  const router = useRouter();  // Đảm bảo useRouter được sử dụng trong Client Component
  console.log('Router state:', router);

  console.log(router); // Kiểm tra xem router có được khởi tạo đúng cách không

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://9160-117-7-238-234.ngrok-free.app/api/auth/local/register', {
        username,
        email,
        password,
      });

      console.log('Registration successful:', response.data);

      localStorage.setItem('token', response.data.jwt);

      setMessage('Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.');

      setTimeout(() => {
        router.push('/login');  // Điều hướng sau khi đăng ký thành công
      }, 5000); 
    } catch (error) {
      console.error('Registration error:', error.response);
      setError(error.response?.data?.error?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <h2 className="text-center">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 mt-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
