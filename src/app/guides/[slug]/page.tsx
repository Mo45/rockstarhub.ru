// /src/app/guides/[slug]/page.tsx

import axios from 'axios';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import AwardSection from '@/components/AwardSection';
import AchievementsList from '@/components/AchievementsList';
import { generateSEOMetadata } from '@/components/SEOMetaTags';
import OrganizationSchema from '@/components/OrganizationSchema';

interface Author {
  id: number;
  name: string;
  bio: string;
  avatar: {
    url: string;
    formats: {
      thumbnail: {
        url: string;
      };
    };
  } | null;
}

// Тип для данных из API (соответствует response.txt)
interface ApiAward {
  id: number;
  title_ru: string;
  title_en: string;
  description: string;
  bronze: number | null;
  silver: number | null;
  gold: number | null;
  platinum: number | null;
  image: {
    id: number;
    url: string;
    formats: {
      thumbnail: {
        url: string;
      };
    };
  } | null;
}

// Тип для компонента AwardSection (соответствует AwardSection.tsx)
interface AwardSectionAward {
  id: number;
  description: string;
  bronze?: number;
  silver?: number;
  gold?: number;
  platinum?: number;
  title_en: string;
  title_ru: string;
  image?: {
    id: number;
    url: string;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

// Тип для данных достижений из API (соответствует response.txt)
interface ApiAchievement {
  id: number;
  name_ru: string;
  name_en: string;
  description: string;
  howtounlock: any[];
  hidden: boolean;
  psn_only: boolean;
  gscore: number;
  psn_trophy: string;
  page_url: string;
  image: {
    id: number;
    url: string;
    alternativeText: string | null;
    formats: {
      thumbnail: {
        url: string;
      };
    };
  } | null;
}

// Тип для компонента AchievementsList (соответствует AchievementsList.tsx)
interface AchievementForComponent {
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

interface Guide {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  youtube: string | null;
  game_name: string;
  game_url: string;
  coverImage: {
    url: string;
    alternativeText: string | null;
    formats: {
      large: {
        url: string;
      };
      medium: {
        url: string;
      };
      small: {
        url: string;
      };
      thumbnail: {
        url: string;
      };
    };
  } | null;
  squareImage: {
    url: string;
    alternativeText: string | null;
    formats: {
      large: {
        url: string;
      };
      medium: {
        url: string;
      };
      small: {
        url: string;
      };
      thumbnail: {
        url: string;
      };
    };
  } | null;
  author: Author;
  awards: ApiAward[];
  achievements: ApiAchievement[];
}

const CACHE = new Map();

async function getGuide(slug: string): Promise<Guide | null> {
  const cacheKey = `guide:${slug}`;
  
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/guides`);
    
    url.searchParams.set('filters[slug][$eq]', slug);
    url.searchParams.set('populate[0]', 'coverImage');
    url.searchParams.set('populate[1]', 'squareImage');
    url.searchParams.set('populate[2]', 'author.avatar');
    url.searchParams.set('populate[3]', 'game.cover_image');
    url.searchParams.set('populate[4]', 'awards.image');
    url.searchParams.set('populate[5]', 'achievements.image');
    
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
    
    const guideData = response.data.data[0];
    CACHE.set(cacheKey, guideData);
    return guideData;
  } catch (error) {
    console.error('Ошибка загрузки гайда:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  
  if (!guide) {
    return {
      title: 'Гайд не найден - Rockstar Хаб',
    };
  }
  
  return generateSEOMetadata({
    title: guide.title,
    description: guide.excerpt,
    imageUrl: guide.coverImage?.url || guide.squareImage?.url,
    url: `/guides/${guide.slug}`,
    type: 'article',
    publishedTime: guide.publishedAt,
    modifiedTime: guide.updatedAt,
    author: guide.author.name,
    section: 'Гайды',
    tags: [guide.game_name, 'Rockstar Games', 'гайд'],
  });
}

function GuideSchema({ guide }: { guide: Guide }) {
  const guideSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': guide.title,
    'description': guide.excerpt,
    'image': guide.coverImage?.url 
      ? `${process.env.NEXT_PUBLIC_BACKEND}${guide.coverImage.url}`
      : undefined,
    'author': {
      '@type': 'Person',
      'name': guide.author.name
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Rockstar Хаб'
    },
    'datePublished': guide.publishedAt,
    'dateModified': guide.updatedAt,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/guides/${guide.slug}`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }}
    />
  );
}

// Функция для преобразования ApiAward в AwardSectionAward
const transformAward = (apiAward: ApiAward): AwardSectionAward => {
  return {
    id: apiAward.id,
    title_ru: apiAward.title_ru,
    title_en: apiAward.title_en,
    description: apiAward.description,
    bronze: apiAward.bronze ?? undefined,
    silver: apiAward.silver ?? undefined,
    gold: apiAward.gold ?? undefined,
    platinum: apiAward.platinum ?? undefined,
    image: apiAward.image ? {
      id: apiAward.image.id,
      url: apiAward.image.url,
      formats: apiAward.image.formats ? {
        thumbnail: apiAward.image.formats.thumbnail ? { url: apiAward.image.formats.thumbnail.url } : undefined
      } : undefined
    } : undefined
  };
};

// Функция для преобразования ApiAchievement в AchievementForComponent
const transformAchievement = (apiAchievement: ApiAchievement): AchievementForComponent => {
  return {
    id: apiAchievement.id,
    name_ru: apiAchievement.name_ru,
    name_en: apiAchievement.name_en,
    description: apiAchievement.description,
    howtounlock: apiAchievement.howtounlock,
    hidden: apiAchievement.hidden,
    psn_only: apiAchievement.psn_only,
    gscore: apiAchievement.gscore,
    psn_trophy: apiAchievement.psn_trophy,
    image: apiAchievement.image ? {
      url: apiAchievement.image.url,
      alternativeText: apiAchievement.image.alternativeText,
      formats: {
        thumbnail: {
          url: apiAchievement.image.formats.thumbnail.url
        }
      }
    } : null,
    page_url: apiAchievement.page_url
  };
};

export default async function GuidePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const guide = await getGuide(slug);
  
  if (!guide) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <GuideSchema guide={guide} />
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
            <Link href="/guides" className="hover:text-gray-700 transition-colors">
              Гайды
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-rockstar-500 font-medium">{guide.title}</span>
          </li>
        </ol>
      </nav>
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {guide.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              {guide.author.avatar && (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND}${guide.author.avatar.formats.thumbnail.url}`}
                  alt={guide.author.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span>{guide.author.name}</span>
            </div>
            <span>•</span>
            <time dateTime={guide.publishedAt}>
              {formatDate(guide.publishedAt)}
            </time>
            <span>•</span>
            <div>
              Игра:{' '}
              <Link 
                href={guide.game_url} 
                className="text-rockstar-500 hover:text-rockstar-600 transition-colors"
              >
                {guide.game_name}
              </Link>
            </div>
          </div>

          {guide.excerpt && (
            <p className="text-lg text-gray-700 italic border-l-4 border-rockstar-500 pl-4 py-2">
              {guide.excerpt}
            </p>
          )}
        </header>

        {/* Обложка */}
        {guide.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND}${guide.coverImage.url}`}
              alt={guide.coverImage.alternativeText || guide.title}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Основной контент */}
        <section className="mb-8">
          {guide.content && guide.content.length > 0 ? (
            <div className="prose max-w-none">
              <BlocksRenderer content={guide.content} />
            </div>
          ) : (
            <p className="text-gray-500">Контент отсутствует</p>
          )}
        </section>

        {/* Видео */}
        {guide.youtube && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Видео-гайд</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${guide.youtube}`}
                title={`Видео-гайд: ${guide.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-80 rounded-lg"
              ></iframe>
            </div>
          </section>
        )}

        {/* Награды */}
        {guide.awards && guide.awards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Награды</h2>
            <div className="space-y-6">
              {guide.awards.map((award) => (
                <AwardSection 
                  key={award.id} 
                  award={transformAward(award)} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Достижения */}
        {guide.achievements && guide.achievements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Связанные достижения</h2>
            <AchievementsList 
              achievements={guide.achievements.map(transformAchievement)} 
              gameSlug={guide.game_url.split('/').pop() || ''} 
              limit={5}
            />
          </section>
        )}

        {/* Информация об авторе */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-start gap-4">
            {guide.author.avatar && (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND}${guide.author.avatar.formats.thumbnail.url}`}
                alt={guide.author.name}
                className="w-16 h-16 rounded-full flex-shrink-0"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">{guide.author.name}</h3>
              {guide.author.bio && (
                <p className="text-gray-600 text-sm">{guide.author.bio}</p>
              )}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}