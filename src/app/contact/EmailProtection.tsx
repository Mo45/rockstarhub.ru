'use client';

import { useState, useEffect } from 'react';

export default function EmailProtection() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Разбиваем email на части и собираем его на клиенте
    // Это защищает от простых спам-ботов
    const user = 'info';
    const domain = 'rockstarhub.ru';
    setEmail(`${user}@${domain}`);
  }, []);

  return (
    <p className="text-rockstar-500">
      {email || 'Загрузка...'}
    </p>
  );
}