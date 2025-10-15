// /src/app/guides/[game_url]/[slug]/page.tsx

import { notFound } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image'
import './article-styles.css';
import { SiRockstargames, SiSteam } from 'react-icons/si';
import { IoLogoXbox } from 'react-icons/io5';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import OrganizationSchema from '@/components/OrganizationSchema';
import { generateSEOMetadata } from '@/components/SEOMetaTags';
import ShareButtons from '@/components/ShareButtons';

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
  author: any;
  game_name: string;
  game_url: string;
  backGroundImg?: any;
  backGroundHex?: string;
  accentHex?: string;
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

async function getGuide(game_url: string, slug: string): Promise<Guide | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/articles?filters[slug][$eq]=${slug}&filters[game_url][$eq]=${game_url}&populate=*`
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

export async function generateMetadata({ params }: { params: Promise<{ game_url: string; slug: string }> }) {
  const { game_url, slug } = await params;
  const guide = await getGuide(game_url, slug);
  
  if (!guide) {
    return {
      title: 'Гайд не найден - Rockstar Хаб',
    };
  }
  
  return generateSEOMetadata({
    title: guide.title,
    description: guide.excerpt,
    imageUrl: guide.coverImage?.url,
    url: `/guides/${guide.game_url}/${guide.slug}`,
    type: 'article',
    publishedTime: guide.publishedAt,
    modifiedTime: guide.updatedAt,
    author: guide.author?.name,
    section: guide.game_name,
  });
}

export async function generateStaticParams() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/articles?fields[0]=slug&fields[1]=game_url`
    );
    
    return response.data.data.map((guide: Guide) => ({
      game_url: guide.game_url,
      slug: guide.slug,
    }));
  } catch (error) {
    console.error('Ошибка генерации статических параметров:', error);
    return [];
  }
}

export default async function GuidePage(props: { params: Promise<{ game_url: string; slug: string }> }) {
  const { game_url, slug } = await props.params;
  const guide = await getGuide(game_url, slug);
  
  if (!guide) {
    notFound();
  }
  
  let authorWithAvatar: Author | null = null;
  if (guide.author && guide.author.name) {
    authorWithAvatar = await getAuthor(guide.author.name);
  }
  
  const readingTime = calculateReadingTime(guide.content);

  const guideUrl = `${process.env.NEXT_PUBLIC_FRONTEND}/guides/${guide.game_url}/${guide.slug}`;

  const backgroundStyle: React.CSSProperties & { [key: `--${string}`]: string } = {};
  
  if (guide.backGroundImg?.url) {
    backgroundStyle.backgroundImage = `url(${process.env.NEXT_PUBLIC_BACKEND}${guide.backGroundImg.url})`;
    backgroundStyle.backgroundRepeat = 'repeat';
  } else if (guide.backGroundHex) {
    backgroundStyle.backgroundColor = guide.backGroundHex;
  }
  
  if (guide.accentHex) {
    backgroundStyle['--accent-color'] = guide.accentHex;
  }
  
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
      '@id': `https://rockstarhub.ru/guides/${guide.game_url}/${guide.slug}`
    },
    'articleSection': guide.game_name,
    'articleBody': guide.excerpt,
  };

  return (
    <div style={backgroundStyle} className="article-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }}
      />
      <OrganizationSchema />
      
      {guide.coverImage && (
        <div className="max-w-6xl mx-auto">
          <Image 
            src={`${process.env.NEXT_PUBLIC_BACKEND}${guide.coverImage.formats?.large?.url || guide.coverImage.url}`} 
            alt={guide.coverImage.alternativeText || guide.title}
            decoding="async"
            loading="lazy"
            className="rounded-lg mt-2 md:mt-6 w-full h-auto object-cover"
          />
        </div>
      )}
      
      <main className="min-h-screen p-2 md:p-8 max-w-4xl mx-auto">
        <article className="card rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 accent-heading">
            {guide.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
            
            {guide.game_name && (
              <div className="flex items-center">
                <span className="font-medium">Игра:</span>
                <Link 
                  href={`/games/${guide.game_url}`}
                  className="white-to-orange ml-1"
                >
                  {guide.game_name}
                </Link>
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
        
      </main>
    </div>
  );
}