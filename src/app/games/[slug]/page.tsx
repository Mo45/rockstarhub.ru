// /src/app/games/[slug]/page.tsx

import axios from 'axios';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PlatformTag from '@/components/PlatformTag';
import GameCard from '@/components/GameCard';
import AchievementsList from '@/components/AchievementsList';
import OrganizationSchema from '@/components/OrganizationSchema';
import { generateSEOMetadata } from '@/components/SEOMetaTags';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { TbCalendarWeek } from 'react-icons/tb';

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

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coverImage: any;
  squareImage: any;
  backGroundHex?: string | null;
  accentHex?: string | null;
  category: any;
}

const CACHE = new Map();

// Mapping соответствия игр и категорий
const gameCategoryMap: { [key: string]: string } = {
  'gtavi': 'gtavi',
  'gtao': 'gta-online',
  'gta-v': 'gtav',
  'rdo': 'red-dead-online',
  'rdr2': 'red-dead-redemption-2',
  'rdr': 'red-dead-redemption',
  'lanoire': 'lanoire'
};

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

async function getLatestArticlesByCategory(categorySlug: string, limit: number = 3): Promise<Article[]> {
  const cacheKey = `articles:${categorySlug}:${limit}`;
  
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/articles`);
    
    url.searchParams.set('filters[category][slug][$eq]', categorySlug);
    url.searchParams.set('populate', 'squareImage,coverImage');
    url.searchParams.set('sort', 'publishedAt:desc');
    url.searchParams.set('pagination[pageSize]', limit.toString());
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );
    
    const articlesData = response.data.data;
    CACHE.set(cacheKey, articlesData);
    return articlesData;
  } catch (error) {
    console.error('Ошибка загрузки статей:', error);
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

export default async function GamePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  
  // Получаем slug категории для текущей игры
  const categorySlug = gameCategoryMap[slug];
  
  // Параллельная загрузка игры, достижений и последних новостей
  const [game, achievements, latestArticles] = await Promise.all([
    getGame(slug),
    getAchievements(slug),
    categorySlug ? getLatestArticlesByCategory(categorySlug, 3) : Promise.resolve([])
  ]);
  
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
          {game.platforms.map(platform => (
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

          {/* Блок последних новостей */}
          {latestArticles.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Последние новости</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestArticles.map((article) => {
                  const image = article.squareImage || article.coverImage;
                  const imageFormats = image?.formats || {};
                  
                  return (
                    <div key={article.id} className="card article-list-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <Link href={`/articles/${article.slug}`} className="block h-full">
                        {image && (
                          <div className="w-full aspect-video relative">
                            <Image 
                              src={`${process.env.NEXT_PUBLIC_BACKEND}${imageFormats.large?.url || image.url}`}
                              decoding="async"
                              loading="lazy"
                              alt={image.alternativeText || article.title}
                              className="w-full h-full object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              fill
                            />
                          </div>
                        )}
                        <div className="p-4 h-full flex flex-col">
                          <h3 className="text-lg font-bold mb-2 line-clamp-3" style={{
                            backgroundColor: article.backGroundHex || 'transparent',
                            color: article.accentHex || 'inherit'
                          }}>
                            {article.title || 'Без названия'}
                          </h3>
                          <div className="article-meta flex justify-between items-center text-xs text-gray-500 mt-auto">
                            <div className="flex items-center gap-1">
                              <TbCalendarWeek className="w-3 h-3" />
                              <span>{new Date(article.publishedAt).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
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
}