import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Thêm message để hiển thị thông báo
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Gửi yêu cầu đăng ký tới Strapi
      const response = await axios.post('http://localhost:1337/api/auth/local/register', {
        username,
        email,
        password,
      });

      console.log('Registration successful:', response.data);

      // Lưu JWT token vào localStorage
      localStorage.setItem('token', response.data.jwt);

      // Hiển thị thông báo yêu cầu xác thực email
      setMessage('Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.');

      // Điều hướng đến trang sau khi đăng ký thành công
      setTimeout(() => {
        navigate('/login'); // Bạn có thể thay đổi theo logic của mình
      }, 5000); // Chờ 5 giây trước khi điều hướng
    } catch (error) {
      console.error('Registration error:', error.response);
      setError(error.response.data.error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5 " style={{ marginTop: '20px', marginLeft: '20px' }}>
      <div className="row justify-content-md-center">
        <div className="col-md-6 ">
          <h2 className="text-center">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>} {/* Hiển thị thông báo */}
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
