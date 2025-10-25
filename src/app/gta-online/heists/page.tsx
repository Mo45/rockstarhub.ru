// /src/app/gta-online/heists/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaUsers } from "react-icons/fa";

interface Heist {
  id: number;
  title_ru: string;
  title_en: string;
  slug: string;
  players: string;
  reward_easy: string;
  reward_hard: string;
  cover_image: {
    id: number;
    url: string;
    formats: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

interface ApiResponse {
  data: Heist[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export default function HeistsPage() {
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeists = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/heists`);
        url.searchParams.set('populate[0]', 'cover_image');
        url.searchParams.set('sort[0]', 'order:asc');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data) {
          setHeists(response.data.data);
        } else {
          setError('Ограбления не найдены');
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError('Не удалось загрузить список ограблений');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHeists();
  }, []);

  const formatReward = (amount: string) => {
    return parseInt(amount).toLocaleString('ru-RU');
  };

  if (error) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 text-red-500 text-center">Ошибка: {error}</div>
        </div>
      </main>
    );
  }

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
              <span className="text-rockstar-500 font-medium">Ограбления в GTA Online</span>
            </li>
          </ol>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Все ограбления в GTA Online: полное прохождение, награды и советы</h1>
        </div>

        {/* Описание страницы */}
        <div className="w-full mb-8">
          <p className="text-gray-500 text-medium">
            Ограбления (Heists) в GTA Online — это масштабные кооперативные миссии, главный источник дохода и самый сложный вызов в игре. В этом полном руководстве вы найдете список всех ограблений, пошаговое прохождение, требования к запуску, секреты и советы для максимальной награды.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heists.map((heist) => {
              const imageFormats = heist.cover_image?.formats || {};
              const imageUrl = imageFormats.large?.url || imageFormats.medium?.url || 
                             imageFormats.small?.url || heist.cover_image?.url;

              return (
                <Link 
                  key={heist.id} 
                  href={`/gta-online/heists/${heist.slug}`}
                  className="aspect-square relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500 block"
                >
                  {imageUrl ? (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${imageUrl}`}
                      alt={heist.title_ru}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Нет изображения</span>
                    </div>
                  )}
                  
                  {/* Плашка с наградой */}
                  <div className="absolute top-3 left-3 bg-rockstar-500 text-black px-2 py-1 rounded-md text-sm font-bold z-10">
                    Куш: {formatReward(heist.reward_easy)} - {formatReward(heist.reward_hard)} GTA$
                  </div>
                  
                  {/* Плашка с количеством игроков */}
                  <div className="absolute top-3 right-3 bg-rockstar-500 text-black px-2 py-1 rounded-md text-sm font-bold z-10">
                    <FaUsers className="inline"/> {heist.players}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-10">
                    <h2 className="text-white font-semibold text-lg mb-1">
                      {heist.title_ru}
                    </h2>
                    <h3 className="text-gray-300 text-sm">
                      {heist.title_en}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}