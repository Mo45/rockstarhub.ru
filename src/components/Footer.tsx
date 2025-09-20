'use client';

import Link from 'next/link';
import { SiDiscord, SiVk, SiTelegram } from 'react-icons/si';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const jwt = localStorage.getItem('jwt');
      setIsAuthenticated(!!jwt);
      setIsLoading(false);
    };

    checkAuth();

    // Слушать кастомные события об изменении аутентификации
    const handleAuthChange = () => checkAuth();
    window.addEventListener('authChange', handleAuthChange);

    // Слушать изменения localStorage из других вкладок
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <footer className="bg-black text-white py-8 mt-auto border-t border-zinc-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Rockstar Хаб</h3>
            <p className="text-gray-500">
              Всё о твоих любимых играх от компании Rockstar Games. Новости, Аналитика, Слухи, Руководства, База данных игр и достижений.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/games" className="gray-to-orange">
                  База данных игр
                </Link>
              </li>
              <li>
                <Link href="/categories" className="gray-to-orange">
                  Категории
                </Link>
              </li>
              <li>
                <Link href="/articles" className="gray-to-orange">
                  Статьи
                </Link>
              </li>
              <li>
                <Link href="/games/gtao" title="Grand Theft Auto Online" className="gray-to-orange">
                  GTA Online
                </Link>
              </li>
              <li>
                <Link href="/games/gtavi" title="Grand Theft Auto VI" className="gray-to-orange">
                  GTA 6
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Полезное</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="gray-to-orange">
                  Конфиденциальность
                </Link>
              </li>
              <li>
                <Link href="/contact" className="gray-to-orange">
                  Обратная связь
                </Link>
              </li>
              <li>
                <Link href="/about" className="gray-to-orange">
                  О сайте
                </Link>
              </li>
              <li>
                {isLoading ? (
                  <span className="text-gray-500">Загрузка...</span>
                ) : isAuthenticated ? (
                  <Link href="/account" className="gray-to-orange">
                    Аккаунт
                  </Link>
                ) : (
                  <Link href="/register" className="gray-to-orange">
                    Регистрация
                  </Link>
                )}
              </li>
              <li>
                <Link href="/donate" className="gray-to-orange">
                  Донат
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Соцсети</h4>
            <div className="flex space-x-4">
              <a href="#" className="gray-to-orange">
                <span className="sr-only">Discord</span>
                <SiDiscord className="w-6 h-6" />
              </a>
              <a href="#" className="gray-to-orange">
                <span className="sr-only">VK</span>
                <SiVk className="w-6 h-6" />
              </a>
              <a href="#" className="gray-to-orange">
                <span className="sr-only">Telegram</span>
                <SiTelegram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center text-gray-700 md:text-left mb-4 md:mb-0">
            <p>&copy; MMXXV RockstarHub. Все права защищены.</p>
          </div>
          <div className="text-center md:text-right text-xs text-gray-700">
            <p>R, Rockstar, Red Dead Redemption, GTA, Grand Theft Auto, and related logos are trademarks of Take-Two Interactive Software, Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}