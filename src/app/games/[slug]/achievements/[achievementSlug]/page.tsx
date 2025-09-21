// /src/app/games/[slug]/achievements/[achievementSlug]/page.tsx
import axios from 'axios';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'
import { IoLogoXbox, IoLogoPlaystation } from 'react-icons/io5';
import { FaTrophy, FaEyeSlash } from "react-icons/fa6";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import GameCard from '@/components/GameCard';
import PlatformTag from '@/components/PlatformTag';
import OrganizationSchema from '@/components/OrganizationSchema';

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
  youtube_howto?: string;
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

async function getAchievementBySlug(achievementSlug: string): Promise<Achievement | null> {
  const cacheKey = `achievement:${achievementSlug}`;
  
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/achievements?filters[page_url][$eq]=${achievementSlug}&populate[0]=image`,
      { timeout: 25000 }
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    const achievementData = response.data.data[0];
    CACHE.set(cacheKey, achievementData);
    return achievementData;
  } catch (error) {
    console.error('Ошибка загрузки достижения:', error);
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
      `${process.env.NEXT_PUBLIC_BACKEND}/api/achievements?filters[game_name][$eq]=${gameName}&populate[0]=image&pagination[page]=1&pagination[pageSize]=100`,
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

// Функции для трофеев
const getTrophyText = (trophy: string): string => {
  switch (trophy) {
    case 'bronze': return 'Бронзовый трофей';
    case 'silver': return 'Серебрянный трофей';
    case 'gold': return 'Золотой трофей';
    case 'platinum': return 'Платиновый трофей';
    default: return trophy;
  }
};

const getTrophyColor = (trophy: string): string => {
  switch (trophy) {
    case 'bronze': return 'bg-amber-600';
    case 'silver': return 'bg-gray-400';
    case 'gold': return 'bg-yellow-500';
    case 'platinum': return 'bg-slate-300 text-gray-800';
    default: return 'bg-gray-500';
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; achievementSlug: string }> }) {
  const { achievementSlug } = await params;
  const achievement = await getAchievementBySlug(achievementSlug);
  
  if (!achievement) {
    return {
      title: 'Достижение не найдено - Rockstar Хаб',
    };
  }
  
  return {
    title: `${achievement.name_ru} - Как получить достижение - Rockstar Хаб`,
    description: achievement.description.substring(0, 160) + '...',
  };
}

export default async function AchievementPage(props: { params: Promise<{ slug: string; achievementSlug: string }> }) {
  const { slug, achievementSlug } = await props.params;
  const [game, achievement, allAchievements] = await Promise.all([
    getGame(slug),
    getAchievementBySlug(achievementSlug),
    getAllAchievements(slug)
  ]);
  
  if (!game || !achievement) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <OrganizationSchema />
      
      <nav className="mb-6">
        <Link 
          href={`/games/${game.slug}`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Назад к игре
        </Link>
        <span className="mx-2">/</span>
        <Link 
          href={`/games/${game.slug}/achievements`}
          className="text-blue-600 hover:text-blue-800"
        >
          Достижения
        </Link>
        <span className="mx-2">/</span>
        <span>{achievement.name_ru}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-0">{achievement.name_ru}</h1>
            <h2 className="text-1xl text-gray-700 font-bold mb-6">{achievement.name_en}</h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {achievement.image && (
                <div className="relative w-64 h-64 flex-shrink-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND}${achievement.image.url}`}
                    decoding="async"
                    loading="lazy"
                    fill={true}
                    alt={achievement.image.alternativeText || achievement.name_ru}
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex-1">
                {/* Бейджи под описанием */}
                <div className="flex flex-wrap gap-2 mt-0">
                  {achievement.gscore && (
                  <span 
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs cursor-help"
                    title="Очков Gamerscore"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 2048 2048"><path d="M1024 0q141 0 272 36t245 103 207 160 160 208 103 245 37 272q0 141-36 272t-104 244-160 207-207 161-245 103-272 37q-141 0-272-36t-244-104-207-160-161-207-103-245-37-272q0-141 36-272t103-245 160-207 208-160T751 37t273-37zm367 956H984v173h192v187q-29 13-60 17t-63 4q-72 0-124-23t-87-64-52-97-17-125q0-69 20-127t60-101 95-67 127-24q71 0 140 14t132 50V572q-65-24-132-33t-137-9q-115 0-212 35T697 666 586 826t-40 213q0 115 35 204t101 150 156 93 205 32q91 0 180-17t168-64V956z"></path></svg> {achievement.gscore}
                  </span>
                  )}
                  
                  {achievement.psn_trophy && (
                    <span 
                      className={`${getTrophyColor(achievement.psn_trophy)} px-2 py-1 rounded text-xs cursor-help`}
                      title="Уровень трофея PlayStation"
                    >
                      <FaTrophy className="w-4 h-4 inline-block" /> {getTrophyText(achievement.psn_trophy)}
                    </span>
                  )}
                  
                  {achievement.psn_only && (
                    <span 
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs cursor-help"
                      title="Достижение доступно только на PlayStation"
                    >
                      <IoLogoPlaystation className="w-4 h-4 inline-block" /> PSN Only
                    </span>
                  )}
                  
                  {achievement.hidden && (
                    <span 
                      className="bg-gray-700 text-white px-2 py-1 rounded text-xs cursor-help"
                      title="Секретное достижение"
                    > 
                      <FaEyeSlash className="w-4 h-4 inline-block" /> Секретное
                    </span>
                  )}
                  <h2 className="text-xl font-semibold mb-2 mt-2">Описание достижения</h2>
                  <p className="text-gray-700 mb-4">{achievement.description}</p>

                </div>
              </div>
            </div>
            
            {achievement.howtounlock && achievement.howtounlock.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Как разблокировать</h2>
                <div className="prose max-w-none">
                  <BlocksRenderer content={achievement.howtounlock} />
                </div>
              </div>
            )}
          </div>

          {achievement.youtube_howto && (
            <div className="mt-6">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${achievement.youtube_howto}`}
                  title={`Видео-руководство как выполнить достижение «${achievement.name_ru}»`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-80 rounded-lg"
                ></iframe>
              </div>
            </div>
          )}

        </div>
        
        <div className="lg:col-span-1">
          <GameCard 
            game={game} 
            achievements={allAchievements}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}