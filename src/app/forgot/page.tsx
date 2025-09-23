// /src/app/forgot/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
        return;
      }

      setSuccess('Инструкции по сбросу пароля отправлены на ваш email');
    } catch (error) {
      setError('Ошибка при подключении к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <div className="card rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Восстановление пароля</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded-lg border-zinc-900 focus:outline-none focus:ring-2 focus:ring-rockstar-500"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-orange disabled:opacity-50"
            >
              {loading ? 'Отправка...' : 'Отправить инструкции'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Вспомнили пароль?{' '}
              <Link href="/login" className="orange-to-white">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}