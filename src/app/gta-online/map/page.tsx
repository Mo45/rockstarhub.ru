// /src/app/gta-online/map/page.tsx

"use client";

import Link from 'next/link';

export default function MapPage() {
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
        <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500">
          <iframe 
            src="https://gtavmap.rockstarhub.ru/"
            className="w-full h-[600px] border-0"
            title="Интерактивная карта игральных карт GTA Online"
            allowFullScreen
          />
          
          {/* Плашка с информацией */}
          <div className="absolute top-3 left-3 bg-rockstar-500 text-black px-2 py-1 rounded-md text-sm font-bold z-10">
            54 игральные карты
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-10">
            <h2 className="text-white font-semibold text-lg mb-1">
              Интерактивная карта игральных карт
            </h2>
            <h3 className="text-gray-300 text-sm">
              Interactive Playing Cards Map
            </h3>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
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