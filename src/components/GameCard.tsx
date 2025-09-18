// components/GameCard.tsx
import PurchaseLink from '@/components/PurchaseLink';
import { formatPlatformKey } from '@/lib/platforms';
import { FaTrophy } from "react-icons/fa6";

interface Game {
  id: number;
  slug: string;
  full_title: string;
  short_title: string;
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
  purchase_links: {
    [key: string]: string;
  };
}

interface Achievement {
  id: number;
  gscore: number;
  psn_trophy: string;
  psn_only: boolean;
  hidden: boolean;
}

interface GameCardProps {
  game: Game;
  achievements?: Achievement[];
  className?: string;
}

export default function GameCard({ game, achievements = [], className = '' }: GameCardProps) {
  // Расчет статистики достижений
  const achievementsStats = {
    totalGscore: achievements.reduce((sum, achievement) => sum + (achievement.gscore || 0), 0),
    bronzeTrophies: achievements.filter(a => a.psn_trophy === 'bronze').length,
    silverTrophies: achievements.filter(a => a.psn_trophy === 'silver').length,
    goldTrophies: achievements.filter(a => a.psn_trophy === 'gold').length,
    platinumTrophies: achievements.filter(a => a.psn_trophy === 'platinum').length,
  };

  // Сортировка дат выхода в хронологическом порядке
  const sortedReleaseDates = game.release_dates 
    ? Object.entries(game.release_dates)
        .sort(([, dateA], [, dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    : [];

  return (
    <div className={`card p-6 rounded-lg ${className}`}>
      {game.cover_image && (
        <div className="w-full mb-3 overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND}${game.cover_image.formats.large?.url || game.cover_image.url}`}
            alt={game.cover_image.alternativeText || game.full_title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-3">
        {game.full_title}
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-sm text-gray-700">Разработчик / Издатель</h3>
          <p className="font-xs">{game.developer} / {game.publisher}</p>
        </div>
        
        {sortedReleaseDates.length > 0 && (
          <div>
            <h3 className="font-sm text-gray-700">Даты выхода</h3>
            <ul className="text-tiny space-y-1">
              {sortedReleaseDates.map(([platformKey, date]) => (
                <li key={platformKey}>
                  {formatPlatformKey(platformKey)}: {new Date(date).toLocaleDateString('ru-RU')}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Раздел Достижения */}
        {achievements.length > 0 && (
          <div>
            <h3 className="font-sm text-gray-700">Достижения / Трофеи</h3>
            <div className="text-sm space-y-2 mt-2">
              <div className="flex gap-4 items-center">

                <span className="font-semibold cursor-help" title="Очков GamerScore">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 2048 2048"><path d="M1024 0q141 0 272 36t245 103 207 160 160 208 103 245 37 272q0 141-36 272t-104 244-160 207-207 161-245 103-272 37q-141 0-272-36t-244-104-207-160-161-207-103-245-37-272q0-141 36-272t103-245 160-207 208-160T751 37t273-37zm367 956H984v173h192v187q-29 13-60 17t-63 4q-72 0-124-23t-87-64-52-97-17-125q0-69 20-127t60-101 95-67 127-24q71 0 140 14t132 50V572q-65-24-132-33t-137-9q-115 0-212 35T697 666 586 826t-40 213q0 115 35 204t101 150 156 93 205 32q91 0 180-17t168-64V956z"></path></svg> {achievementsStats.totalGscore}
                </span>

                <span className="trophy-bronze" title="Бронзовых трофеев">
                  <FaTrophy className="w-4 h-4 inline-block" /> {achievementsStats.bronzeTrophies}
                </span>

                <span className="trophy-silver" title="Серебрянных трофеев">
                  <FaTrophy className="w-4 h-4 inline-block" /> {achievementsStats.silverTrophies}
                </span>

                <span className="trophy-gold" title="Золотых трофеев">
                  <FaTrophy className="w-4 h-4 inline-block" /> {achievementsStats.goldTrophies}
                </span>

                <span className="trophy-platinum" title="Платиновых трофеев">
                  <FaTrophy className="w-4 h-4 inline-block" /> {achievementsStats.platinumTrophies}
                </span>

              </div>
            </div>
          </div>
        )}
        
        {game.purchase_links && Object.keys(game.purchase_links).length > 0 && (
          <div>
            <h3 className="font-sm text-gray-700">Купить игру</h3>
            <div className="space-y-2 mt-2">
              {Object.entries(game.purchase_links).map(([platformKey, url]) => (
                <PurchaseLink
                  key={platformKey}
                  platformKey={platformKey}
                  url={url}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}