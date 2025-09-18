import axios from 'axios';
import { notFound } from 'next/navigation';
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/games?filters[slug][$eq]=${slug}&populate[0]=cover_image&populate[1]=game_facts`,
      { timeout: 15000 }
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/achievements?filters[game_name][$eq]=${gameName}&populate[0]=image&pagination[page]=1&pagination[pageSize]=200`,
      { timeout: 15000 }
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

export default async function GamePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  
  // Параллельная загрузка игры и достижений
  const [game, achievements] = await Promise.all([
    getGame(slug),
    getAchievements(slug)
  ]);
  
  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <GameSchema game={game} />
      <OrganizationSchema />
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

          <AchievementsList achievements={achievements} gameSlug={params.slug} limit={3}/>
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