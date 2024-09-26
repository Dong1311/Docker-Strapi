import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Lấy code từ query string
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code'); // Lấy giá trị của mã code từ URL

  const navigate = useNavigate(); // Hook điều hướng

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:1337/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code, // gửi mã code để xác thực
          password,
          passwordConfirmation: confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      setMessage('Password has been reset successfully.');
      setError('');

      setTimeout(() => {
        navigate('/login'); 
      }, 1000); 

    } catch (error) {
      setError('Error resetting password');
      setMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center mb-4">Reset Password</h2>

            {message && <div className="alert alert-success" role="alert">{message}</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <form onSubmit={handleResetPassword}>
              <div className="form-group mb-3">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
