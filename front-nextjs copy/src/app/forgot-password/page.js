"use client"

import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://9160-117-7-238-234.ngrok-free.app/api/auth/forgot-password', {
        email: email,
      });
      setMessage('An email has been sent to reset your password.');
      setError('');
    } catch (err) {
      console.error('Error response:', err.response); // Log thông tin chi tiết từ Strapi
      setError('Error sending reset password email. Please try again.');
      setMessage('');
    }
  };
  

  return (
    <div className="forgot-password-container">
      <h2 className='ms-4 mt-4'>Forgot Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleForgotPassword}>
        <div className="form-group ms-4 mt-4">
          <label className='mb-4'>Email:</label>
          <input
            type="email"
            className="form-control mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary ms-4">Send Reset Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
