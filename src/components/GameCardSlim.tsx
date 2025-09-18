import Link from 'next/link';
import PlatformTag from '@/components/PlatformTag';
import { FaTrophy } from "react-icons/fa6";

interface Achievement {
  id: number;
  gscore: number;
  psn_trophy: string;
}

interface Game {
  id: number;
  slug: string;
  full_title: string;
  short_title: string;
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
  achievements?: Achievement[];
}

interface GameCardSlimProps {
  game: Game;
  className?: string;
}

export default function GameCardSlim({ game, className = '' }: GameCardSlimProps) {
  // Расчет статистики достижений
  const achievementsStats = {
    totalGscore: game.achievements?.reduce((sum, achievement) => sum + (achievement.gscore || 0), 0) || 0,
    bronzeTrophies: game.achievements?.filter(a => a.psn_trophy === 'bronze').length || 0,
    silverTrophies: game.achievements?.filter(a => a.psn_trophy === 'silver').length || 0,
    goldTrophies: game.achievements?.filter(a => a.psn_trophy === 'gold').length || 0,
    platinumTrophies: game.achievements?.filter(a => a.psn_trophy === 'platinum').length || 0,
  };

  return (
    <div className={`card single-game p-6 cursor-pointer rounded-lg ${className}`}>
      <Link href={`/games/${game.slug}`} className="block">
        {game.cover_image && (
          <div className="relative h-96 w-full mb-3">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND}${game.cover_image.formats.small?.url || game.cover_image.url}`}
              decoding="async"
              loading="lazy"
              alt={game.cover_image.alternativeText || game.full_title}
              className="object-cover rounded-lg"
            />
          </div>
        )}
        
        <h2 className="text-xl font-semibold mb-0">
          {game.full_title}
        </h2>
        
        {game.short_title && (
          <h3 className="text-lg text-gray-700 mb-3">
            {game.short_title}
          </h3>
        )}
        
        {/* Платформы с использованием PlatformTag */}
        {game.platforms && game.platforms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {game.platforms.map(platform => (
              <PlatformTag
                key={platform}
                platform={platform}
                tagClassName="platform-tag-sm"
              />
            ))}
          </div>
        )}
        
        {/* Статистика достижений */}
        {game.achievements && game.achievements.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">Достижения / Трофеи</h3>
            <div className="text-sm text-white space-y-2 mt-2">
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
      </Link>
    </div>
  );
}