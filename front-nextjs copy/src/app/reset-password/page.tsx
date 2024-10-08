"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

const ResetPasswordContent = () => { // Đổi tên component để dùng trong Suspense
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const searchParams = useSearchParams(); // Lấy searchParams
  const code = searchParams.get('code') || ""; // Lấy tham số 'code' từ URL

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://9160-117-7-238-234.ngrok-free.app/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code, 
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
        router.push('/login'); 
      }, 1000); 

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); 
      } else {
        setError('Error resetting password');
      }
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

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;
