// /src/app/logout/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Удаляем токен и данные пользователя
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    
    // Перенаправляем на главную страницу
    router.push('/');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Выход из системы</h1>
        <p>Выполняется выход...</p>
      </div>
    </main>
  );
}