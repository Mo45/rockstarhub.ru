// /src/app/gta-online/heists/[slug]/page.tsx

import { notFound } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import AwardSection from '@/components/AwardSection';
import ShareButtons from '@/components/ShareButtons';
import { FaDiscord } from "react-icons/fa";
import './styles.css';

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

const transformAward = (award: any): Award => ({
  ...award,
  bronze: award.bronze ?? undefined,
  silver: award.silver ?? undefined,
  gold: award.gold ?? undefined,
  platinum: award.platinum ?? undefined,
});

async function getHeist(slug: string): Promise<HeistData | null> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/heists`);
    url.searchParams.set('filters[slug][$eq]', slug);
    url.searchParams.set('populate[0]', 'cover_image');
    url.searchParams.set('populate[1]', 'awards.image');
    
    const response = await axios.get<ApiResponse>(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      const rawData = response.data.data[0];
      const transformedData = {
        ...rawData,
        awards: rawData.awards?.map(transformAward) || []
      };
      return transformedData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const heistData = await getHeist(slug);
  
  if (!heistData) {
    return {
      title: 'Ограбление не найдено - Rockstar Хаб',
      description: 'Запрашиваемое ограбление не найдено в базе данных GTA Online.',
    };
  }
  
  const title = `${heistData.title_ru} - ${heistData.title_en} | Ограбления GTA Online - Heists`;
  const description = `Подробное руководство по ограблению «${heistData.title_ru}» в GTA Online. Потенциальный куш: ${parseInt(heistData.reward_easy).toLocaleString('ru-RU')} - ${parseInt(heistData.reward_hard).toLocaleString('ru-RU')} GTA$. Количество игроков: ${heistData.players}`;
  const imageUrl = heistData.cover_image ? `${process.env.NEXT_PUBLIC_BACKEND}${heistData.cover_image.url}` : null;
  
  return {
    title,
    description,
    keywords: ['GTA Online', 'ограбления', heistData.title_ru, heistData.title_en, 'награды', 'элитные испытания'],
    creator: 'Kirill Krasin',
    publisher: 'Rockstar Хаб',
    metadataBase: new URL('https://rockstarhub.ru'),
    alternates: {
      canonical: `/gta-online/heists/${heistData.slug}`
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://rockstarhub.ru/gta-online/heists/${heistData.slug}`,
      siteName: 'Rockstar Хаб',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/heists?fields[0]=slug`
    );
    
    return response.data.data.map((heist: HeistData) => ({
      slug: heist.slug,
    }));
  } catch (error) {
    console.error('Ошибка генерации статических параметров:', error);
    return [];
  }
}

export default async function SingleHeistPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const heistData = await getHeist(slug);
  
  if (!heistData) {
    notFound();
  }

  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString('ru-RU');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const articleUrl = `${process.env.NEXT_PUBLIC_FRONTEND}/gta-online/heists/${heistData.slug}`;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            {`GTA Online — ${heistData?.title_ru} (${heistData?.title_en}): Описание, испытания и награды`}
          </h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            {/* Изображение ограбления */}
            <div className="flex items-center">
              <Image 
                src="/Heist-Green.webp"
                alt="Ограбление GTA Online"
                width={64}
                height={64}
                className="mr-2"
              />
              <div>
                <h2 className="text-lg text-gray-300">{heistData.title_ru}</h2>
                <h2 className="text-lg text-gray-400">{heistData.title_en}</h2>
              </div>
            </div>

            {/* Кнопка Discord */}
            <a
              href="https://discord.gg/EkfMa3MU"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#5865F2] text-[#E0E3FF] px-4 py-3 rounded-lg hover:bg-[#4752c4] hover:text-[#FFFFFF] transition-colors duration-200 w-full md:w-auto justify-center"
            >
              <FaDiscord className="w-6 h-6" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm">Найти напарников для</span>
                <span className="text-xs">На нашем Discord-сервере</span>
              </div>
            </a>
          </div>
        </div>

        {/* Объединенный блок: изображение + информация об ограблении */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Основное изображение - на мобильном сверху, на десктопе слева */}
          {heistData.cover_image && (
            <div className="w-full h-full">
              <Image 
                src={`${process.env.NEXT_PUBLIC_BACKEND}${heistData.cover_image.url}`}
                alt={heistData.title_ru}
                width={1920}
                height={1080}
                className="w-full h-full object-cover rounded-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
          
          {/* Карточка с информацией об ограблении - на мобильном снизу, на десктопе справа */}
          <div className="card rounded-lg p-6 md:p-8 h-full">
            <h3 className="text-xl font-bold text-center mb-6">{heistData.title_ru} / {heistData.title_en}</h3>
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
                  <h4 className="text-sm text-gray-400 mb-1">Потенциальный куш (Легко):</h4>
                  <p className="text-lg font-semibold">{formatNumber(heistData.reward_easy)} GTA$</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Потенциальный куш (Нормально):</h4>
                  <p className="text-lg font-semibold">{formatNumber(heistData.reward_normal)} GTA$</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Потенциальный куш (Сложно):</h4>
                  <p className="text-lg font-semibold">{formatNumber(heistData.reward_hard)} GTA$</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Элитные испытания */}
        {heistData.elite_challenges && heistData.elite_challenges.length > 0 && (
          <article className="card rounded-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold mb-6">Элитные испытания ограбления {heistData.title_ru}</h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-500 text-medium mb-6">
                В каждом завершающем этапе ограбления есть набор бонусных заданий, называемых «Элитными испытаниями», которые требуют от игроков либо завершить финал ограбления за ограниченное время, либо выполнить определённые задания в ходе миссии. Использование «Пропуска поездки» или «Быстрого перезапуска» в любом ограблении аннулирует элитные бонусы.
              </p>
            </div>
            <div className="prose prose-lg max-w-none article-content">
              <BlocksRenderer content={heistData.elite_challenges} />
            </div>
          </article>
        )}

        {heistData.youtube && (
            <div className="mb-8">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${heistData.youtube}`}
                  title={`Видео-руководство как завершить ограбление «${heistData.title_ru}»`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-80 rounded-lg"
                ></iframe>
              </div>
            </div>
          )}

        {/* Описание ограбления */}
        {heistData.content && heistData.content.length > 0 && (
          <article className="card rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">Описание ограбления</h3>
            <div className="prose prose-lg max-w-none article-content">
              <BlocksRenderer content={heistData.content} />
            </div>
          </article>
        )}

        {/* Секции с наградами */}
        {heistData.awards && heistData.awards.map((award) => (
          <AwardSection key={award.id} award={award} />
        ))}

        {/* Кнопки поделиться */}
        <div className="p-6 md:p-8 mb-8">
          <div className="flex justify-end-safe items-center gap-4">
            <ShareButtons 
              url={articleUrl} 
              title={`${heistData.title_ru} - ${heistData.title_en} в GTA Online`} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}