// /src/app/games/[slug]/achievements/page.tsx

import axios from 'axios';
import { notFound } from 'next/navigation';
import PlatformTag from '@/components/PlatformTag';
import GameCard from '@/components/GameCard';
import AchievementsList from '@/components/AchievementsList';
import OrganizationSchema from '@/components/OrganizationSchema';
import Link from 'next/link';
import SearchAchievements from './SearchAchievements';

interface Game {
  id: number;
  slug: string;
  full_title: string;
  short_title: string;
  description: any[];
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
  
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/games?filters[slug][$eq]=${slug}&populate[0]=cover_image&populate[1]=game_facts`,
      { timeout: 25000 }
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    const gameData = response.data.data[0];
    CACHE.set(cacheKey, gameData);
    return gameData;
  } catch (error) {
    console.error('Ошибка загрузки игры:', error);
    return null;
  }
}

async function getAllAchievements(gameName: string): Promise<Achievement[]> {
  const cacheKey = `all-achievements:${gameName}`;
  
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/achievements?filters[game_name][$eq]=${gameName}&populate[0]=image&sort[0]=gscore:desc&pagination[page]=1&pagination[pageSize]=200`,
      { timeout: 25000 }
    );
    
    const achievementsData = response.data.data;
    CACHE.set(cacheKey, achievementsData);
    return achievementsData;
  } catch (error) {
    console.error('Ошибка загрузки достижений:', error);
    return [];
  }
}

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGame(slug);
  
  if (!game) {
    return {
      title: 'Игра не найдена - RockstarHub',
    };
  }
  
  return {
    title: `${game.full_title} - Все достижения - Rockstar Хаб`,
    description: `Полный список достижений для игры ${game.full_title}`,
  };
}

export default async function AchievementsPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [game, achievements] = await Promise.all([
    getGame(slug),
    getAllAchievements(slug)
  ]);
  
  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <GameSchema game={game} />
      <OrganizationSchema />
      
      {/* Хлебные крошки */}
      <nav className="mb-6">
        <Link 
          href={`/games/${game.slug}`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Назад к игре
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Достижения {game.full_title}
        </h1>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {game.platforms.map(platform => (
            <PlatformTag key={platform} platform={platform} />
          ))}
        </div>
      </header>
      
      <SearchAchievements achievements={achievements} gameSlug={slug} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AchievementsList achievements={achievements} gameSlug={slug} />
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