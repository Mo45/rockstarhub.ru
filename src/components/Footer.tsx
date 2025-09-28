// /src/components/Footer.tsx

import Link from 'next/link';
import { SiDiscord, SiVk, SiTelegram } from 'react-icons/si';
import { useState, useEffect } from 'react';

export default function Footer() {

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
                <Link href="/gta-online-weekly" className="gray-to-orange">
                  2X Бонусы GTA Online
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
                <Link href="/rules" className="gray-to-orange">
                  Правила
                </Link>
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

              <a href="https://discord.gg/EkfMa3MU" className="gray-to-orange" rel="noopener noreferrer" target="_blank">
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