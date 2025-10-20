// /src/app/gta-online/map/page.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaExpand, FaCompress } from 'react-icons/fa';

export default function MapPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Вход в полноэкранный режим
      const element = containerRef.current;
      if (element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
          (element as any).msRequestFullscreen();
        }
      }
    } else {
      // Выход из полноэкранного режима
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!document.fullscreenElement ||
        !!(document as any).webkitFullscreenElement ||
        !!(document as any).msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Хлебные крошки */}
        <nav className="flex mb-4" aria-label="Хлебные крошки">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 transition-colors">
                Главная
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link href="/gta-online" className="hover:text-gray-700 transition-colors">
                Хаб GTA Online
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-rockstar-500 font-medium">Карта игральных карт</span>
            </li>
          </ol>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Карта игральных карт в GTA Online</h1>
        </div>

        {/* Описание страницы */}
        <div className="w-full mb-8">
          <p className="text-gray-500 text-medium">
            Интерактивная карта всех 54 игральных карт в GTA Online. Найдите все карты, чтобы получить уникальные награды: 
            костюм высокого стола, специальный пистолет и бонусы в наличных.
          </p>
        </div>

        {/* Карта в iframe */}
        <div 
          ref={containerRef}
          className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500"
        >
          <iframe 
            ref={iframeRef}
            src="https://gtavmap.rockstarhub.ru/"
            className="w-full h-screen border-0"
            title="Интерактивная карта игральных карт GTA Online"
            allowFullScreen
          />
          
          {/* Кнопка полноэкранного режима */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-3 right-3 bg-rockstar-500 text-black p-2 rounded-md z-10 hover:bg-rockstar-600 transition-colors"
            aria-label={isFullscreen ? "Выйти из полноэкранного режима" : "Открыть в полноэкранном режиме"}
          >
            {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 p-6 card rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Награды за сбор всех 54 карт:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Костюм высокого стола (награда от миссии «Охотник за сокровищами»)</li>
            <li>Пистолет «Золотая палочка» с уникальным дизайном</li>
            <li>Бонус в размере 66 000 GTA$ (по 1 000$ за каждую карту + 12 000$ бонус)</li>
            <li>Достижение «Охотник за сокровищами»</li>
          </ul>
        </div>

      </div>
    </main>
  );
}