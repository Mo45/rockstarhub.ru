// /src/app/games/[slug]/page.tsx

import axios from 'axios';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PlatformTag from '@/components/PlatformTag';
import GameCard from '@/components/GameCard';
import AchievementsList from '@/components/AchievementsList';
import OrganizationSchema from '@/components/OrganizationSchema';
import { generateSEOMetadata } from '@/components/SEOMetaTags';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

interface Game {
  id: number;
  slug: string;
  full_title: string;
  short_title: string;
  description: any[];
  youtube_video: string;
  cover_image: {
    url: string;
    alternativeText: string | null;
    formats: {
      large: {
        url: string;
      };
    };
  } | null;
  platforms: string[];
  release_dates: {
    [key: string]: string;
  };
  developer: string;
  publisher: string;
  game_facts: {
    id: number;
    text: string;
  }[];
  purchase_links: {
    [key: string]: string;
  };
  additional_links: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Achievement {
  id: number;
  name_ru: string;
  name_en: string;
  description: string;
  howtounlock: any[];
  hidden: boolean;
  psn_only: boolean;
  gscore: number;
  psn_trophy: string;
  image: {
    url: string;
    alternativeText: string | null;
    formats: {
      thumbnail: {
        url: string;
      };
    };
  } | null;
  page_url: string;
}

const CACHE = new Map();

async function getGame(slug: string): Promise<Game | null> {
  const cacheKey = `game:${slug}`;
  
  // Проверяем кэш
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/games`);
    
    url.searchParams.set('filters[slug][$eq]', slug);
    url.searchParams.set('populate[0]', 'cover_image');
    url.searchParams.set('populate[1]', 'game_facts');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        timeout: 25000
      }
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    const gameData = response.data.data[0];
    // Кэшируем результат
    CACHE.set(cacheKey, gameData);
    return gameData;
  } catch (error) {
    console.error('Ошибка загрузки игры:', error);
    return null;
  }
}

async function getAchievements(gameName: string): Promise<Achievement[]> {
  const cacheKey = `achievements:${gameName}`;
  
  // Проверяем кэш
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/achievements`);
    
    url.searchParams.set('filters[game_name][$eq]', gameName);
    url.searchParams.set('populate[0]', 'image');
    url.searchParams.set('pagination[page]', '1');
    url.searchParams.set('pagination[pageSize]', '200');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        timeout: 25000
      }
    );
    
    const achievementsData = response.data.data;
    // Кэшируем результат
    CACHE.set(cacheKey, achievementsData);
    return achievementsData;
  } catch (error) {
    console.error('Ошибка загрузки достижений:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGame(slug);
  
  if (!game) {
    return {
      title: 'Игра не найдена - Rockstar Хаб',
    };
  }
  
  return generateSEOMetadata({
    title: game.full_title,
    description: game.description && game.description.length > 0 
      ? game.description[0].children[0].text.substring(0, 160) + '...' 
      : `Информация об игре ${game.full_title} от Rockstar Games`,
    imageUrl: game.cover_image?.url,
    url: `/games/${game.slug}`,
    type: 'article',
    publishedTime: game.publishedAt,
    modifiedTime: game.updatedAt,
    author: game.developer,
    section: 'Видеоигры',
    tags: [...game.platforms, game.developer, 'Rockstar Games'],
  });
}

// Функция для преобразования RichText в простой текст
const getPlainText = (richText: any[]) => {
  if (!richText || !Array.isArray(richText)) return '';
  
  return richText.map(item => 
    item.children.map((child: any) => child.text).join('')
  ).join('\n');
};

function GameSchema({ game }: { game: Game }) {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    'name': game.full_title,
    'description': game.description && game.description.length > 0 
      ? getPlainText(game.description).substring(0, 160) + '...' 
      : `Информация об игре ${game.full_title}`,
    'image': game.cover_image?.url 
      ? `${process.env.NEXT_PUBLIC_BACKEND}${game.cover_image.url}`
      : undefined,
    'author': game.developer ? {
      '@type': 'Organization',
      'name': game.developer
    } : undefined,
    'publisher': game.publisher ? {
      '@type': 'Organization',
      'name': game.publisher
    } : undefined,
    'gamePlatform': game.platforms,
    'applicationCategory': 'Game'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
    />
  );
}

// /src/app/games/[slug]/page.tsx

import axios from 'axios';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PlatformTag from '@/components/PlatformTag';
import GameCard from '@/components/GameCard';
import AchievementsList from '@/components/AchievementsList';
import OrganizationSchema from '@/components/OrganizationSchema';
import { generateSEOMetadata } from '@/components/SEOMetaTags';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

// Настройки кэширования (12 часов для игр и достижений)
const CACHE_CONFIG = {
  game: 43200, // 12 часов
  achievements: 43200, // 12 часов
  metadata: 7200, // 2 часа
  staticParams: 86400, // 24 часа
} as const;

// Функция для получения заголовков Cache-Control
function getCacheHeaders(type: 'game' | 'achievements' | 'metadata' | 'staticParams') {
  const maxAge = CACHE_CONFIG[type];
  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    'CDN-Cache-Control': `public, s-maxage=${maxAge}`,
  };
}

interface Game {
  id: number;
  slug: string;
  full_title: string;
  short_title: string;
  description: any[];
  youtube_video: string;
  cover_image: {
    url: string;
    alternativeText: string | null;
    formats: {
      large: {
        url: string;
      };
    };
  } | null;
  platforms: string[];
  release_dates: {
    [key: string]: string;
  };
  developer: string;
  publisher: string;
  game_facts: {
    id: number;
    text: string;
  }[];
  purchase_links: {
    [key: string]: string;
  };
  additional_links: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Achievement {
  id: number;
  name_ru: string;
  name_en: string;
  description: string;
  howtounlock: any[];
  hidden: boolean;
  psn_only: boolean;
  gscore: number;
  psn_trophy: string;
  image: {
    url: string;
    alternativeText: string | null;
    formats: {
      thumbnail: {
        url: string;
      };
    };
  } | null;
  page_url: string;
}

// Временный кэш в памяти для SSR
const MEMORY_CACHE = new Map();

async function getGame(slug: string): Promise<Game | null> {
  const cacheKey = `game:${slug}`;
  
  // Проверяем кэш в памяти (только для SSR)
  if (typeof window === 'undefined' && MEMORY_CACHE.has(cacheKey)) {
    return MEMORY_CACHE.get(cacheKey);
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/games`);
    
    url.searchParams.set('filters[slug][$eq]', slug);
    // Оптимизированный запрос - только необходимые поля
    url.searchParams.set('fields[0]', 'slug');
    url.searchParams.set('fields[1]', 'full_title');
    url.searchParams.set('fields[2]', 'short_title');
    url.searchParams.set('fields[3]', 'description');
    url.searchParams.set('fields[4]', 'youtube_video');
    url.searchParams.set('fields[5]', 'platforms');
    url.searchParams.set('fields[6]', 'release_dates');
    url.searchParams.set('fields[7]', 'developer');
    url.searchParams.set('fields[8]', 'publisher');
    url.searchParams.set('fields[9]', 'createdAt');
    url.searchParams.set('fields[10]', 'updatedAt');
    url.searchParams.set('fields[11]', 'publishedAt');
    
    // Оптимизированный populate
    url.searchParams.set('populate[0]', 'cover_image');
    url.searchParams.set('populate[1]', 'game_facts');
    url.searchParams.set('populate[2]', 'purchase_links');
    url.searchParams.set('populate[3]', 'additional_links');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          ...getCacheHeaders('game'),
        },
        timeout: 15000
      }
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    const gameData = response.data.data[0];
    
    // Кэшируем в памяти для SSR
    if (typeof window === 'undefined') {
      MEMORY_CACHE.set(cacheKey, gameData);
      setTimeout(() => MEMORY_CACHE.delete(cacheKey), 60000); // Очищаем через 1 минуту
    }
    
    return gameData;
  } catch (error) {
    console.error('Ошибка загрузки игры:', error);
    return null;
  }
}

async function getAchievements(gameName: string): Promise<Achievement[]> {
  const cacheKey = `achievements:${gameName}`;
  
  // Проверяем кэш в памяти (только для SSR)
  if (typeof window === 'undefined' && MEMORY_CACHE.has(cacheKey)) {
    return MEMORY_CACHE.get(cacheKey);
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/achievements`);
    
    url.searchParams.set('filters[game_name][$eq]', gameName);
    // Оптимизированный запрос - только необходимые поля
    url.searchParams.set('fields[0]', 'name_ru');
    url.searchParams.set('fields[1]', 'name_en');
    url.searchParams.set('fields[2]', 'description');
    url.searchParams.set('fields[3]', 'howtounlock');
    url.searchParams.set('fields[4]', 'hidden');
    url.searchParams.set('fields[5]', 'psn_only');
    url.searchParams.set('fields[6]', 'gscore');
    url.searchParams.set('fields[7]', 'psn_trophy');
    url.searchParams.set('fields[8]', 'page_url');
    
    // Только миниатюры изображений
    url.searchParams.set('populate[0]', 'image.formats.thumbnail');
    
    // Пагинация для оптимизации
    url.searchParams.set('pagination[page]', '1');
    url.searchParams.set('pagination[pageSize]', '50');
    url.searchParams.set('sort[0]', 'gscore:desc');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          ...getCacheHeaders('achievements'),
        },
        timeout: 10000
      }
    );
    
    const achievementsData = response.data.data;
    
    // Кэшируем в памяти для SSR
    if (typeof window === 'undefined') {
      MEMORY_CACHE.set(cacheKey, achievementsData);
      setTimeout(() => MEMORY_CACHE.delete(cacheKey), 60000); // Очищаем через 1 минуту
    }
    
    return achievementsData;
  } catch (error) {
    console.error('Ошибка загрузки достижений:', error);
    return [];
  }
}

// Экспортируем revalidate для ISR
export const revalidate = 43200; // Ревалидировать страницу каждые 12 часов

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/games`);
    
    url.searchParams.set('filters[slug][$eq]', slug);
    // Только поля, необходимые для метаданных
    url.searchParams.set('fields[0]', 'full_title');
    url.searchParams.set('fields[1]', 'short_title');
    url.searchParams.set('fields[2]', 'description');
    url.searchParams.set('fields[3]', 'publishedAt');
    url.searchParams.set('fields[4]', 'updatedAt');
    url.searchParams.set('fields[5]', 'developer');
    url.searchParams.set('fields[6]', 'platforms');
    
    // Только cover_image для метаданных
    url.searchParams.set('populate[0]', 'cover_image');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          ...getCacheHeaders('metadata'),
        },
        timeout: 10000
      }
    );
    
    if (response.data.data.length === 0) {
      return {
        title: 'Игра не найдена - Rockstar Хаб',
      };
    }
    
    const game = response.data.data[0];
    
    // Функция для извлечения текста из RichText
    const getPlainText = (richText: any[]): string => {
      if (!richText || !Array.isArray(richText)) return '';
      
      return richText.map(item => 
        item.children?.map((child: any) => child.text || '').join('') || ''
      ).join(' ').substring(0, 160) + '...';
    };
    
    return generateSEOMetadata({
      title: game.full_title,
      description: game.short_title || getPlainText(game.description) || `Информация об игре ${game.full_title} от Rockstar Games`,
      imageUrl: game.cover_image?.url,
      url: `/games/${slug}`,
      type: 'article',
      publishedTime: game.publishedAt,
      modifiedTime: game.updatedAt,
      author: game.developer,
      section: 'Видеоигры',
      tags: [...(game.platforms || []), game.developer, 'Rockstar Games'],
    });
  } catch (error) {
    console.error('Ошибка загрузки метаданных игры:', error);
    return {
      title: 'Игра - Rockstar Хаб',
    };
  }
}

export async function generateStaticParams() {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/games`);
    
    // Только slug для генерации путей
    url.searchParams.set('fields[0]', 'slug');
    url.searchParams.set('filters[publishedAt][$notNull]', 'true');
    url.searchParams.set('pagination[pageSize]', '100');
    url.searchParams.set('sort[0]', 'publishedAt:desc');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          ...getCacheHeaders('staticParams'),
        },
        timeout: 15000
      }
    );
    
    return response.data.data.map((game: Game) => ({
      slug: game.slug,
    }));
  } catch (error) {
    console.error('Ошибка генерации статических параметров для игр:', error);
    return [];
  }
}

// Функция для преобразования RichText в простой текст
const getPlainText = (richText: any[]): string => {
  if (!richText || !Array.isArray(richText)) return '';
  
  return richText.map(item => 
    item.children?.map((child: any) => child.text || '').join('') || ''
  ).join(' ');
};

function GameSchema({ game }: { game: Game }) {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    'name': game.full_title,
    'description': game.short_title || getPlainText(game.description).substring(0, 160) + '...',
    'image': game.cover_image?.url 
      ? `${process.env.NEXT_PUBLIC_BACKEND}${game.cover_image.url}`
      : undefined,
    'author': game.developer ? {
      '@type': 'Organization',
      'name': game.developer
    } : undefined,
    'publisher': game.publisher ? {
      '@type': 'Organization',
      'name': game.publisher
    } : undefined,
    'gamePlatform': game.platforms,
    'applicationCategory': 'Game',
    'datePublished': game.publishedAt,
    'dateModified': game.updatedAt
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
    />
  );
}

export default async function GamePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  
  try {
    // Параллельная загрузка игры и достижений с правильной типизацией
    const [gameResult, achievementsResult] = await Promise.allSettled([
      getGame(slug),
      getAchievements(slug)
    ]);

    const game = gameResult.status === 'fulfilled' ? gameResult.value : null;
    const achievements = achievementsResult.status === 'fulfilled' ? achievementsResult.value : [];
    
    if (!game) {
      notFound();
    }

    return (
      <div className="min-h-screen p-8 max-w-6xl mx-auto">
        <GameSchema game={game} />
        <OrganizationSchema />
        
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
              <Link href="/games" className="hover:text-gray-700 transition-colors">
                Игры
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-rockstar-500 font-medium">{game.full_title}</span>
            </li>
          </ol>
        </nav>
        
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {game.full_title}
          </h1>
          
          {game.short_title && (
            <h2 className="text-xl text-gray-600 mb-2">
              {game.short_title}
            </h2>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            {game.platforms?.map(platform => (
              <PlatformTag key={platform} platform={platform} />
            ))}
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Описание</h2>
              {game.description && game.description.length > 0 ? (
                <div className="prose max-w-none">
                  <BlocksRenderer content={game.description} />
                </div>
              ) : (
                <p className="text-gray-500">Описание отсутствует</p>
              )}
            </section>
            
            {game.game_facts && game.game_facts.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Интересные факты</h2>
                <ul className="list-disc list-inside space-y-2">
                  {game.game_facts.map(fact => (
                    <li key={fact.id}>{fact.text}</li>
                  ))}
                </ul>
              </section>
            )}

            {game.youtube_video && (
              <div className="mt-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">{`Трейлер ${game.full_title}`}</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${game.youtube_video}`}
                    title={`Трейлер ${game.full_title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-80 rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}

            <AchievementsList achievements={achievements} gameSlug={slug} limit={3}/>
          </div>
          
          <div className="lg:col-span-1">
            <GameCard 
              game={game} 
              achievements={achievements}
              className="sticky top-4"
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Ошибка загрузки страницы игры:', error);
    notFound();
  }
}