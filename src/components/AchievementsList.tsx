// components/AchievementsList.tsx

"use client";

import Link from 'next/link';
import Image from 'next/image'
import { IoLogoXbox, IoLogoPlaystation } from 'react-icons/io5';
import { FaTrophy, FaEyeSlash } from "react-icons/fa6";
import { useState } from 'react';

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

interface AchievementsListProps {
  achievements: Achievement[];
  gameSlug: string;
  limit?: number;
}

// Функции для трофеев
const getTrophyText = (trophy: string): string => {
  switch (trophy) {
    case 'bronze': return 'Бронзовый';
    case 'silver': return 'Серебрянный';
    case 'gold': return 'Золотой';
    case 'platinum': return 'Платиновый';
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

export default function AchievementsList({ achievements, gameSlug, limit }: AchievementsListProps) {
  const [revealedAchievements, setRevealedAchievements] = useState<number[]>([]);
  
  if (achievements.length === 0) {
    return null;
  }

  // Ограничиваем количество достижений, если передан limit
  const displayedAchievements = limit && limit > 0 
    ? achievements.slice(0, limit) 
    : achievements;

  const handleReveal = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!revealedAchievements.includes(id)) {
      setRevealedAchievements([...revealedAchievements, id]);
    }
  };

  return (
    <section className="mt-0">
      <div className="space-y-4">
        {displayedAchievements.map(achievement => {
          const isHidden = achievement.hidden && !revealedAchievements.includes(achievement.id);
          
          return (
            <Link 
              href={`/games/${gameSlug}/achievements/${achievement.page_url}`}
              key={achievement.id}
              className="block"
            >
              <div className="card p-4 rounded-lg cursor-pointer transition-transform hover:scale-102 single-achievement relative">
                <div className={`flex items-start gap-4 ${isHidden ? 'blur-sm' : ''}`}>
                  {achievement.image && (
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND}${achievement.image.url}`}
                        decoding="async"
                        loading="lazy"
                        fill={true}
                        alt={achievement.image.alternativeText || achievement.name_ru}
                        className="object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h2 className="font-medium text-lg mb-1 inline-block">{achievement.name_ru}</h2> 
                    <span className="text-gray-600 md:inline-block hidden mx-2">/</span> 
                    <h3 className="font-medium text-gray-600 text-sm mb-1 md:inline-block hidden">{achievement.name_en}</h3> 
                    
                    {!isHidden && (
                      <>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
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
                              className={`${getTrophyColor(achievement.psn_trophy)} text-white px-2 py-1 rounded text-xs cursor-help`}
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
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Оверлей для скрытых достижений */}
                {isHidden && (
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center blurred rounded-lg z-10 cursor-pointer"
                    onClick={(e) => handleReveal(achievement.id, e)}
                  >
                    <h2 className="z-20 text-white text-center font-medium text-lg">{achievement.name_ru}</h2>
                    <h3 className="z-20 text-gray-300 text-center text-sm">{achievement.name_en}</h3>
                    <button className="z-20 text-white bg-black px-4 py-2 rounded-lg mt-3 hover:bg-rockstar-500 transition-colors">
                      Посмотреть секретное достижение
                    </button>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      
      {limit && limit > 0 && achievements.length > limit && (
        <div className="mt-6 text-center">
          <Link 
            href={`/games/${gameSlug}/achievements`}
            className="button-orange"
          >
            Все достижения ({achievements.length})
          </Link>
        </div>
      )}
    </section>
  );
}