// /src/app/reset/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      router.push('/account');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== passwordConfirmation) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          passwordConfirmation,
          code, // Код из URL параметра
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
        return;
      }

      setSuccess('Пароль успешно изменен!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError('Ошибка при подключении к серверу');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rockstar-500 mx-auto"></div>
          <p className="mt-4">Проверка авторизации...</p>
        </div>
      </main>
    );
  }

  if (!code) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-md mx-auto">
          <div className="card rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Ошибка</h1>
            <p className="text-red-600 mb-4">Отсутствует код сброса пароля</p>
            <Link 
              href="/forgot" 
              className="block text-center text-rockstar-500 hover:underline"
            >
              Запросить новый код
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <div className="card rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Сброс пароля</h1>
          
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
              <label htmlFor="password" className="block mb-2 font-medium">
                Новый пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 border rounded-lg border-zinc-900 focus:outline-none focus:ring-2 focus:ring-rockstar-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="passwordConfirmation" className="block mb-2 font-medium">
                Подтверждение пароля
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 border rounded-lg border-zinc-900 focus:outline-none focus:ring-2 focus:ring-rockstar-500"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-orange disabled:opacity-50"
            >
              {loading ? 'Сброс пароля...' : 'Сбросить пароль'}
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