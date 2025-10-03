// components/AwardSection.tsx
import Image from 'next/image';

interface ImageData {
  id: number;
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

interface Award {
  id: number;
  description: string;
  bronze?: number;
  silver?: number;
  gold?: number;
  platinum?: number;
  title_en: string;
  title_ru: string;
  image?: ImageData;
}

interface AwardSectionProps {
  award?: Award;
  className?: string;
}

export default function AwardSection({ award, className = '' }: AwardSectionProps) {

  if (!award) {
    return null;
  }

  const formatValue = (value?: number): string => {
    return value !== undefined ? value.toString() : '—';
  };

  return (
    <section className={`mt-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Награды</h2>
      <div className="card rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">

          {award.image && (
            <div className="flex-shrink-0">
              <Image 
                src={`${process.env.NEXT_PUBLIC_BACKEND}${award.image.url}`}
                alt={award.title_en}
                width={210}
                height={210}
                className="rounded-lg"
              />
            </div>
          )}
          
          <div className="flex-1">

            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">{award.title_ru}</h3>
              <h4 className="text-lg text-gray-300">{award.title_en}</h4>
            </div>
            
            <p className="text-gray-300 mb-6">{award.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-zinc-800 rounded-lg">
                <div className="text-2xl font-bold text-amber-800">{formatValue(award.bronze)}</div>
                <div className="text-sm text-gray-300 mt-2">Бронзовая</div>
              </div>
              <div className="text-center p-4 bg-zinc-800 rounded-lg">
                <div className="text-2xl font-bold text-zinc-500">{formatValue(award.silver)}</div>
                <div className="text-sm text-gray-300 mt-2">Серебряная</div>
              </div>
              <div className="text-center p-4 bg-zinc-800 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{formatValue(award.gold)}</div>
                <div className="text-sm text-gray-300 mt-2">Золотая</div>
              </div>
              <div className="text-center p-4 bg-zinc-800 rounded-lg">
                <div className="text-2xl font-bold text-emerald-300">{formatValue(award.platinum)}</div>
                <div className="text-sm text-gray-300 mt-2">Платиновая</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}