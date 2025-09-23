// /src/app/games/page.tsx

import axios from 'axios';
import GameCardSlim from '@/components/GameCardSlim';

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
      thumbnail: {
        url: string;
      };
      small: {
        url: string;
      };
    };
  } | null;
  platforms: string[];
  release_dates: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

async function getGames(): Promise<Game[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/games?populate=*&sort[0]=position:asc`
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Ошибка загрузки игр:', error);
    return [];
  }
}

export async function generateMetadata() {
  return {
    title: 'Все игры - Rockstar Хаб',
    description: 'Список всех игр от Rockstar Games на RockstarHub',
  };
}

export default async function GamesPage() {
  const games = await getGames();
  
  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Игры Rockstar Games
        </h1>
        <p className="text-gray-600">
          Игр в каталоге: {games.length}
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCardSlim 
            key={game.id} 
            game={game}
          />
        ))}
      </div>
      
      {games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            На сайте пока нет игр.
          </p>
        </div>
      )}
    </div>
  );
}