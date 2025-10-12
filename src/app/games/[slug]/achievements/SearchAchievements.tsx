// /src/app/games/[slug]/achievements/SearchAchievements.tsx

'use client';

import { useState, useMemo } from 'react';
import { Achievement } from './types';

interface SearchAchievementsProps {
  achievements: Achievement[];
  gameSlug: string;
}

export default function SearchAchievements({ achievements, gameSlug }: SearchAchievementsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAchievements = useMemo(() => {
    if (!searchQuery) return achievements;
    
    const query = searchQuery.toLowerCase();
    return achievements.filter(achievement => 
      achievement.name_ru.toLowerCase().includes(query) ||
      achievement.name_en.toLowerCase().includes(query)
    );
  }, [achievements, searchQuery]);

  return (
    <div className="w-full mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск достижений..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="card w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rockstar-500"
        />
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {filteredAchievements.map(achievement => (
              <a
                key={achievement.id}
                href={`/games/${gameSlug}/achievements/${achievement.page_url}`}
                className="block p-3 hover:bg-zinc-800 border-b border-zinc-800 last:border-b-0"
              >
                <div className="font-medium text-rockstar-500 hover:text-rockstar-600">{achievement.name_ru}</div>
                <div className="text-sm text-gray-600">{achievement.name_en}</div>
              </a>
            ))}
            {filteredAchievements.length === 0 && (
              <div className="p-3 text-gray-500">Ничего не найдено</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}