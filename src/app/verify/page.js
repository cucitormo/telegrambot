'use client';

import { useState } from 'react';
import { Input, Button, Card } from 'react-daisyui';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [needPassword, setNeedPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    setMessage('');

    const phone = localStorage.getItem('telegramPhone');
    const codeHash = localStorage.getItem('telegramCodeHash');
    const session = localStorage.getItem('telegramSession');

    if (!phone || !codeHash || !session) {
      setMessage('❌ Missing data, try login again');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, codeHash, session }),
      });

      const { status, data, error } = await res.json();

      if (status === 'success') {
        setMessage('✅ Login successful!');
      } else if (status === 'need_password') {
        setNeedPassword(true);
        localStorage.setItem('telegramSession', data.session); // update session
        setMessage('🔐 2FA enabled, please enter your password');
      } else {
        setMessage(error || '❌ Verification failed');
      }

    } catch (err) {
      setMessage('❌ Network error during verification');
    }

    setLoading(false);
  };

  const handlePasswordVerify = async () => {
    setLoading(true);
    setMessage('');

    const session = localStorage.getItem('telegramSession');

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, session }),
      });

      const { status, data, error } = await res.json();

      if (status === 'success') {
        setMessage('✅ Password verified, login complete!');
      } else {
        setMessage(error || '❌ Password verification failed');
      }

    } catch (err) {
      setMessage('❌ Network error during password verification');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <Card className="w-full max-w-md p-6 bg-base-100 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          {needPassword ? '🔒 2FA Password' : '🔐 Enter OTP'}
        </h2>

        {!needPassword ? (
          <>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mb-4"
            />
            <Button
              color="primary"
              fullWidth
              onClick={handleVerify}
              disabled={!code}
              loading={loading}
            >
              Verify OTP
            </Button>
          </>
        ) : (
          <>
            <Input
              type="password"
              placeholder="Enter 2FA password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <Button
              color="primary"
              fullWidth
              onClick={handlePasswordVerify}
              disabled={!password}
              loading={loading}
            >
              Verify Password
            </Button>
          </>
        )}

        {message && <p className="mt-4 text-center">{message}</p>}
      </Card>
    </div>
  );
}
