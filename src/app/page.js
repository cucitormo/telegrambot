'use client';

import { useState } from 'react';
import { Input, Select, Button, Card } from 'react-daisyui';
import { useRouter } from 'next/navigation';

const countries = [
  { code: '+62', name: 'Indonesia 🇮🇩' },
  { code: '+1', name: 'USA 🇺🇸' },
  { code: '+44', name: 'UK 🇬🇧' },
  { code: '+91', name: 'India 🇮🇳' },
  { code: '+81', name: 'Japan 🇯🇵' },
  { code: '+33', name: 'France 🇫🇷' },
  { code: '+49', name: 'Germany 🇩🇪' },
  { code: '+61', name: 'Australia 🇦🇺' },
];

export default function Home() {
  const [countryCode, setCountryCode] = useState('+62');
  const [number, setNumber] = useState('');
  const [phoneCodeHash, setPhoneCodeHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

const handleSendOTP = async () => {
  setLoading(true);
  setMessage('');
  const phone = countryCode + number;

  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const result = await res.json();
    console.log(result, '👉 OTP result');

    if (result.status === 'success') {
       localStorage.setItem('telegramPhone', phone);
      localStorage.setItem('telegramSession', result.data.session); // ✨ simpan session
      localStorage.setItem('telegramCodeHash', result.data.phoneCodeHash); // ✨ simpan hash

      router.push('/verify'); // redirect ke verify
    } else {
      setMessage(result.error || 'Something went wrong ❌');
    }
  } catch (err) {
    console.error('OTP send error:', err);
    setMessage('Failed to send OTP ❌');
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <Card className="w-full max-w-md p-6 bg-base-100 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">💬 Telegram Login</h2>

        <div className="flex gap-2 mb-4">
          <Select
            className="w-32"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            {countries.map((c) => (
              <Select.Option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </Select.Option>
            ))}
          </Select>

          <Input
            type="text"
            placeholder="812xxxxxxx"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          color="primary"
          fullWidth
          loading={loading}
          disabled={!number}
          onClick={handleSendOTP}
        >
          Send OTP
        </Button>

        {message && <p className="mt-4 text-center text-error">{message}</p>}
      </Card>
    </div>
  );
}
