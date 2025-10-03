// /src/app/gta-online/heists/[slug]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import AwardSection from '@/components/AwardSection';
import { 
  TwitterShareButton, 
  VKShareButton, 
  TelegramShareButton,
  TwitterIcon,
  VKIcon,
  TelegramIcon
} from 'react-share';

interface ImageData {
  id: number;
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

// Интерфейс, совместимый с AwardSection
interface Award {
  id: number;
  description: string;
  bronze?: number;
  silver?: number;
  gold?: number;
  platinum?: number;
  title_en: string;
  title_ru: string;
}

interface HeistData {
  id: number;
  title_en: string;
  title_ru: string;
  slug: string;
  players: string;
  release_date: string;
  setupcost: string;
  reward_easy: string;
  reward_normal: string;
  reward_hard: string;
  content: any[];
  elite_challenges: any[];
  cover_image: ImageData;
  awards: Award[];
  youtube?: string;
}

interface ApiResponse {
  data: HeistData[];
}

// Функция для преобразования null в undefined
const transformAward = (award: any): Award => ({
  ...award,
  bronze: award.bronze ?? undefined,
  silver: award.silver ?? undefined,
  gold: award.gold ?? undefined,
  platinum: award.platinum ?? undefined,
});

export default function SingleHeistPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [heistData, setHeistData] = useState<HeistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeistData = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/heists`);
        url.searchParams.set('filters[slug][$eq]', slug);
        url.searchParams.set('populate[0]', 'cover_image');
        url.searchParams.set('populate[1]', 'awards');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data && response.data.data.length > 0) {
          const rawData = response.data.data[0];
          // Преобразуем awards чтобы заменить null на undefined
          const transformedData = {
            ...rawData,
            awards: rawData.awards?.map(transformAward) || []
          };
          setHeistData(transformedData);
        } else {
          setError('Ограбление не найдено');
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError('Не удалось загрузить данные об ограблении');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchHeistData();
    }
  }, [slug]);

  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString('ru-RU');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
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

  if (!heistData && !loading) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 text-center">Ограбление не найдено</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            {loading ? 'Загрузка...' : `${heistData?.title_ru} описание ограбления ${heistData?.title_en} в GTA Online`}
          </h1>
          
          {/* Изображение ограбления */}
          <div className="flex items-center mb-4">
            <Image 
              src="/Heist-Green.webp"
              alt="Ограбление GTA Online"
              width={64}
              height={64}
              className="mr-2"
            />
            <div>
              <h2 className="text-lg text-gray-300">{heistData?.title_ru}</h2>
              <h2 className="text-lg text-gray-400">{heistData?.title_en}</h2>
            </div>
          </div>
        </div>

        {/* Основное изображение */}
        {heistData?.cover_image && (
          <div className="mb-8">
            <Image 
              src={`${process.env.NEXT_PUBLIC_BACKEND}${heistData.cover_image.url}`}
              alt={heistData.title_ru}
              width={1920}
              height={1080}
              className="w-full h-auto rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>
        )}

        {/* Карточка с информацией об ограблении */}
        {heistData && (
          <div className="card rounded-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-center mb-6">{heistData.title_en}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Левая колонка */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Добавлено в игру:</h4>
                  <p className="text-lg font-semibold">{formatDate(heistData.release_date)}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Количество игроков:</h4>
                  <p className="text-lg font-semibold">{heistData.players}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Стоимость организации:</h4>
                  <p className="text-lg font-semibold">{formatNumber(heistData.setupcost)} GTA$</p>
                </div>
              </div>
              
              {/* Правая колонка */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Куш (Легко):</h4>
                  <p className="text-lg font-semibold">{formatNumber(heistData.reward_easy)} GTA$</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Куш (Нормально):</h4>
                  <p className="text-lg font-semibold">{formatNumber(heistData.reward_normal)} GTA$</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Куш (Сложно):</h4>
                  <p className="text-lg font-semibold">{formatNumber(heistData.reward_hard)} GTA$</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Элитные испытания */}
        {heistData?.elite_challenges && heistData.elite_challenges.length > 0 && (
          <article className="card rounded-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold mb-6">Элитные испытания</h3>
            <div className="prose prose-lg max-w-none article-content">
              <BlocksRenderer content={heistData.elite_challenges} />
            </div>
          </article>
        )}

        {/* Описание ограбления */}
        {heistData?.content && heistData.content.length > 0 && (
          <article className="card rounded-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold mb-6">Описание ограбления</h3>
            <div className="prose prose-lg max-w-none article-content">
              <BlocksRenderer content={heistData.content} />
            </div>
          </article>
        )}

        {/* Секции с наградами */}
        {heistData?.awards && heistData.awards.map((award) => (
          <AwardSection key={award.id} award={award} />
        ))}

        {/* Кнопки поделиться */}
        {heistData && (
          <div className="card rounded-lg p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-400">Поделиться ограблением:</span>
              <div className="flex items-center gap-2">
                <TwitterShareButton
                  url={`https://rockstarhub.ru/gta-online/heists/${heistData.slug}`}
                  title={`${heistData.title_ru} - ${heistData.title_en} в GTA Online`}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <VKShareButton
                  url={`https://rockstarhub.ru/gta-online/heists/${heistData.slug}`}
                  title={`${heistData.title_ru} - ${heistData.title_en} в GTA Online`}
                  image={heistData.cover_image ? `${process.env.NEXT_PUBLIC_BACKEND}${heistData.cover_image.url}` : ''}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <VKIcon size={32} round />
                </VKShareButton>
                <TelegramShareButton
                  url={`https://rockstarhub.ru/gta-online/heists/${heistData.slug}`}
                  title={`${heistData.title_ru} - ${heistData.title_en} в GTA Online`}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}