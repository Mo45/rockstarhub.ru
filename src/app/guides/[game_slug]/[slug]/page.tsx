// /src/app/guides/[game_slug]/[slug]/page.tsx

import { notFound } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { SiRockstargames, SiSteam } from 'react-icons/si';
import { IoLogoXbox } from 'react-icons/io5';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import OrganizationSchema from '@/components/OrganizationSchema';
import { generateSEOMetadata } from '@/components/SEOMetaTags';
import CommentsSection from '@/components/comments/CommentsSection';
import ShareButtons from '@/components/ShareButtons';
import GameCard from '@/components/GameCard';
import AwardSection from '@/components/AwardSection';
import './article-styles.css';

interface Author {
  id: number;
  name: string;
  bio?: string;
  rockstarSocialClub?: string;
  steamID?: string;
  xboxGamerTag?: string;
  avatar?: {
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail: {
        url: string;
      };
    };
  };
}

// Используем более совместимый интерфейс Game
interface Game {
  id: number;
  slug: string;
  full_title: string;
  short_title: string;
  description?: any[];
  youtube_video?: string;
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
  game_facts?: {
    id: number;
    text: string;
  }[];
  purchase_links?: {
    [key: string]: string;
  };
  additional_links?: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface ImageData {
  id: number;
  url: string;
  alternativeText?: string;
  formats?: {
    thumbnail: {
      url: string;
    };
  };
}

interface Award {
  id: number;
  title_ru: string;
  title_en: string;
  description: string;
  bronze?: number;
  silver?: number;
  gold?: number;
  platinum?: number;
  image?: ImageData;
}

interface Achievement {
  id: number;
  name_ru: string;
  name_en: string;
  description: string;
  image?: ImageData;
}

interface Guide {
  id: number;
  title: string;
  slug: string;
  content: any[];
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coverImage: any;
  squareImage?: any;
  author: any;
  category: any;
  tags: any[];
  game: Game;
  awards: Award[];
  achievements: Achievement[];
}

async function getAuthor(name: string): Promise<Author | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/authors?filters[name][$eq]=${name}&populate=*`
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0];
  } catch (error) {
    console.error('Ошибка загрузки автора:', error);
    return null;
  }
}

async function getGuide(game_slug: string, slug: string): Promise<Guide | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/guides?filters[game][slug][$eq]=${game_slug}&filters[slug][$eq]=${slug}&populate[0]=coverImage&populate[1]=squareImage&populate[2]=author.avatar&populate[3]=game.cover_image&populate[4]=awards.image&populate[5]=achievements.image`
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0];
  } catch (error) {
    console.error('Ошибка загрузки гайда:', error);
    return null;
  }
}

function countCharacters(content: any[]): number {
  let count = 0;
  
  const countText = (obj: any) => {
    if (typeof obj === 'string') {
      count += obj.length;
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (key === 'text' && typeof obj[key] === 'string') {
          count += obj[key].length;
        } else if (obj[key] && typeof obj[key] === 'object') {
          countText(obj[key]);
        }
      });
    }
  };

  content.forEach(block => {
    countText(block);
  });

  return count;
}

function calculateReadingTime(content: any[]): number {
  const charactersCount = countCharacters(content);
  const wordsCount = charactersCount / 5;
  const readingTime = Math.ceil(wordsCount / 140);
  return Math.max(1, readingTime);
}

export async function generateMetadata({ params }: { params: Promise<{ game_slug: string; slug: string }> }) {
  const { game_slug, slug } = await params;
  const guide = await getGuide(game_slug, slug);
  
  if (!guide) {
    return {
      title: 'Гайд не найден - Rockstar Хаб',
    };
  }
  
  return generateSEOMetadata({
    title: guide.title,
    description: guide.excerpt,
    imageUrl: guide.coverImage?.url,
    url: `/guides/${guide.game.slug}/${guide.slug}`,
    type: 'article',
    publishedTime: guide.publishedAt,
    modifiedTime: guide.updatedAt,
    author: guide.author?.name,
    section: guide.category?.name,
    tags: guide.tags?.map(tag => tag.name),
  });
}

export async function generateStaticParams() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/guides?fields[0]=slug&populate[0]=game.slug`
    );
    
    return response.data.data.map((guide: Guide) => ({
      game_slug: guide.game.slug,
      slug: guide.slug,
    }));
  } catch (error) {
    console.error('Ошибка генерации статических параметров:', error);
    return [];
  }
}

export default async function GuidePage(props: { params: Promise<{ game_slug: string; slug: string }> }) {
  const { game_slug, slug } = await props.params;
  const guide = await getGuide(game_slug, slug);
  
  if (!guide) {
    notFound();
  }
  
  let authorWithAvatar: Author | null = null;
  if (guide.author && guide.author.name) {
    authorWithAvatar = await getAuthor(guide.author.name);
  }
  
  const readingTime = calculateReadingTime(guide.content);

  const guideUrl = `${process.env.NEXT_PUBLIC_FRONTEND}/guides/${guide.game.slug}/${guide.slug}`;

  const guideSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': guide.title,
    'description': guide.excerpt,
    'image': guide.coverImage?.url ? `${process.env.NEXT_PUBLIC_BACKEND}${guide.coverImage.url}` : undefined,
    'datePublished': guide.publishedAt,
    'dateModified': guide.updatedAt,
    'author': authorWithAvatar ? {
      '@type': 'Person',
      'name': authorWithAvatar.name,
      'description': authorWithAvatar.bio,
      'image': authorWithAvatar.avatar?.url ? `${process.env.NEXT_PUBLIC_BACKEND}${authorWithAvatar.avatar.url}` : undefined
    } : undefined,
    'publisher': {
      '@type': 'Organization',
      'name': 'RockstarHub',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://rockstarhub.ru/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://rockstarhub.ru/guides/${guide.game.slug}/${guide.slug}`
    },
    'articleSection': guide.category?.name,
    'articleBody': guide.excerpt,
    'keywords': guide.tags?.map(tag => tag.name).join(', ')
  };

  return (
    <div className="min-h-screen p-2 md:p-8 max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }}
      />
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
            <Link href={`/games/${guide.game.slug}`} className="hover:text-gray-700 transition-colors">
              {guide.game.short_title || guide.game.full_title}
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-rockstar-500 font-medium">{guide.title}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {guide.coverImage && (
            <div className="mb-6">
              <Image 
                src={`${process.env.NEXT_PUBLIC_BACKEND}${guide.coverImage.formats?.large?.url || guide.coverImage.url}`} 
                alt={guide.coverImage.alternativeText || guide.title}
                decoding="async"
                loading="lazy"
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>
          )}
          
          <main>
            <article className="card rounded-lg p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 accent-heading">
                {guide.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                
                {guide.category && (
                  <div className="flex items-center">
                    <span className="font-medium">Категория:</span>
                    <Link 
                      href={`/categories/${guide.category.slug}`}
                      className="white-to-orange ml-1"
                    >
                      {guide.category.name}
                    </Link>
                  </div>
                )}
                
                {guide.tags && guide.tags.length > 0 && (
                  <div className="flex items-center">
                    <span className="font-medium">Теги:</span>
                    <div className="ml-1 flex flex-wrap gap-1">
                      {guide.tags.map((tag, index) => (
                        <span key={tag.id}>
                          <Link 
                            href={`/tags/${tag.slug}`}
                            className="hover:underline"
                          >
                            {tag.name}
                          </Link>
                          {index < guide.tags.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="font-medium">Время чтения:</span>
                  <span className="ml-1 text-white">{readingTime} мин.</span>
                </div>

              </div>
              
              <div className="prose prose-lg max-w-none article-content">
                <BlocksRenderer content={guide.content} />
              </div>

              {/* Секции с наградами */}
              {guide.awards && guide.awards.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-6 mt-6">Награды</h3>
                  {guide.awards.map((award) => (
                    <AwardSection key={award.id} award={award} />
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <div className="text-xs mt-2 opacity-60">
                  Опубликовано: {new Date(guide.publishedAt).toLocaleDateString('ru-RU')}
                </div>

                <ShareButtons url={guideUrl} title={guide.title} />
              </div>
            </article>

            {authorWithAvatar && (
              <div className="card rounded-lg p-6 mt-8 mb-6 md:mb-0">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                  {authorWithAvatar.avatar && (
                    <div className="flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND}${authorWithAvatar.avatar.formats?.thumbnail?.url || authorWithAvatar.avatar.url}`} 
                        alt={authorWithAvatar.avatar.alternativeText || authorWithAvatar.name}
                        width={130}
                        height={130}
                        decoding="async"
                        loading="lazy"
                        className="rounded-full mx-auto md:mx-0"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{authorWithAvatar.name}</h3>
                    {authorWithAvatar.bio && (
                      <p className="text-sm text-gray-600 mb-4">{authorWithAvatar.bio}</p>
                    )}
                    
                    {/* Социальные сети автора */}
                    <div className="flex justify-center md:justify-start gap-3">
                      {authorWithAvatar.rockstarSocialClub && (
                        <a
                          href={`https://socialclub.rockstargames.com/members/${authorWithAvatar.rockstarSocialClub}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          title="Rockstar Social Club"
                        >
                          <SiRockstargames className="w-6 h-6" />
                        </a>
                      )}
                      {authorWithAvatar.steamID && (
                        <a
                          href={`https://steamcommunity.com/id/${authorWithAvatar.steamID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          title="Steam"
                        >
                          <SiSteam className="w-6 h-6" />
                        </a>
                      )}
                      {authorWithAvatar.xboxGamerTag && (
                        <a
                          href={`https://www.xbox.com/play/user/${authorWithAvatar.xboxGamerTag}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          title="Xbox"
                        >
                          <IoLogoXbox className="w-6 h-6" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <CommentsSection contentType="guides" contentSlug={slug} />
          </main>
        </div>
        
        <div className="lg:col-span-1">
          <GameCard 
            game={guide.game} 
            achievements={[]}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}