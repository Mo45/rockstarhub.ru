// /src/app/articles/[slug]/page.tsx

import { notFound } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image'
import './article-styles.css';
import { SiRockstargames, SiSteam } from 'react-icons/si';
import { IoLogoXbox } from 'react-icons/io5';
import { FaRubleSign, FaYoutube, FaDiscord } from 'react-icons/fa';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import OrganizationSchema from '@/components/OrganizationSchema';
import { generateSEOMetadata } from '@/components/SEOMetaTags';
import CommentsSection from '@/components/comments/CommentsSection';
import ShareButtons from '@/components/ShareButtons';
import SupportProjectBlock from '@/components/SupportProjectBlock';

// Настройки кэширования для разных типов данных (только для заголовков Cache-Control)
const CACHE_CONFIG = {
  article: 7200, // 2 часа
  author: 7200, // 2 часа
  metadata: 7200, // 2 часа
} as const;

// Функция для получения заголовков Cache-Control
function getCacheHeaders(type: 'article' | 'author' | 'metadata') {
  const maxAge = CACHE_CONFIG[type];
  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    'CDN-Cache-Control': `public, s-maxage=${maxAge}`,
  };
}

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

interface Article {
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
  category: any;
  tags: any[];
  backGroundImg?: any;
  backGroundHex?: string;
  accentHex?: string;
  youtube?: string;
}

async function getAuthor(name: string): Promise<Author | null> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/authors`);
    
    url.searchParams.set('filters[name][$eq]', name);
    url.searchParams.set('populate[0]', 'avatar');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          ...getCacheHeaders('author'),
        },
        timeout: 10000
      }
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

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/articles`);
    
    url.searchParams.set('filters[slug][$eq]', slug);
    // Оптимизируем populate - запрашиваем только необходимые поля
    url.searchParams.set('populate[0]', 'coverImage');
    url.searchParams.set('populate[1]', 'author');
    url.searchParams.set('populate[2]', 'category');
    url.searchParams.set('populate[3]', 'tags');
    url.searchParams.set('populate[4]', 'backGroundImg');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          ...getCacheHeaders('article'),
        },
        timeout: 15000
      }
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0];
  } catch (error) {
    console.error('Ошибка загрузки статьи:', error);
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

// Экспортируем revalidate для ISR
export const revalidate = 3600; // Ревалидировать страницу каждые 1 час

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/articles`);
    
    url.searchParams.set('filters[slug][$eq]', slug);
    url.searchParams.set('fields[0]', 'title');
    url.searchParams.set('fields[1]', 'excerpt');
    url.searchParams.set('fields[2]', 'publishedAt');
    url.searchParams.set('fields[3]', 'updatedAt');
    url.searchParams.set('populate[0]', 'coverImage');
    url.searchParams.set('populate[1]', 'author');
    url.searchParams.set('populate[2]', 'category');
    url.searchParams.set('populate[3]', 'tags');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          ...getCacheHeaders('metadata'),
        },
        timeout: 10000
      }
    );
    
    if (response.data.data.length === 0) {
      return {
        title: 'Статья не найдена - Rockstar Хаб',
      };
    }
    
    const article = response.data.data[0];
    
    return generateSEOMetadata({
      title: article.title,
      description: article.excerpt,
      imageUrl: article.coverImage?.url,
      url: `/articles/${slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      author: article.author?.name,
      section: article.category?.name,
      tags: article.tags?.map((tag: any) => tag.name),
    });
  } catch (error) {
    console.error('Ошибка загрузки метаданных статьи:', error);
    return {
      title: 'Статья - Rockstar Хаб',
    };
  }
}

export async function generateStaticParams() {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/articles`);
    
    url.searchParams.set('fields[0]', 'slug');
    url.searchParams.set('pagination[pageSize]', '50');
    url.searchParams.set('filters[publishedAt][$notNull]', 'true');
    url.searchParams.set('sort[0]', 'publishedAt:desc');
    
    const response = await axios.get(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
        },
        timeout: 15000
      }
    );
    
    return response.data.data.map((article: Article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error('Ошибка генерации статических параметров:', error);
    return [];
  }
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  
  // Загружаем статью
  const article = await getArticle(slug);
  
  if (!article) {
    notFound();
  }
  
  // Параллельно загружаем автора и похожие статьи
  let authorWithAvatar: Author | null = null;
  
  try {
    [authorWithAvatar] = await Promise.allSettled([
      article.author && article.author.name ? getAuthor(article.author.name) : Promise.resolve(null)
    ]).then((results) => {
      return [
        results[0].status === 'fulfilled' ? results[0].value : null,
        results[1].status === 'fulfilled' ? results[1].value : []
      ];
    });
  } catch (error) {
    console.error('Ошибка загрузки дополнительных данных:', error);
  }
  
  const readingTime = calculateReadingTime(article.content);
  const articleUrl = `${process.env.NEXT_PUBLIC_FRONTEND}/articles/${article.slug}`;

  const backgroundStyle: React.CSSProperties & { [key: `--${string}`]: string } = {};
  
  if (article.backGroundImg?.url) {
    backgroundStyle.backgroundImage = `url(${process.env.NEXT_PUBLIC_BACKEND}${article.backGroundImg.url})`;
    backgroundStyle.backgroundRepeat = 'repeat';
  } else if (article.backGroundHex) {
    backgroundStyle.backgroundColor = article.backGroundHex;
  }
  
  if (article.accentHex) {
    backgroundStyle['--accent-color'] = article.accentHex;
  }
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.excerpt,
    'image': article.coverImage?.url ? `${process.env.NEXT_PUBLIC_BACKEND}${article.coverImage.url}` : undefined,
    'datePublished': article.publishedAt,
    'dateModified': article.updatedAt,
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
      '@id': `https://rockstarhub.ru/articles/${article.slug}`
    },
    'articleSection': article.category?.name,
    'articleBody': article.excerpt,
    'keywords': article.tags?.map(tag => tag.name).join(', ')
  };

  return (
    <div style={backgroundStyle} className="article-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <OrganizationSchema />
      
      {article.coverImage && (
        <div className="max-w-6xl mx-auto">
          <Image 
            src={`${process.env.NEXT_PUBLIC_BACKEND}${article.coverImage.formats?.large?.url || article.coverImage.url}`}
            alt={article.coverImage.alternativeText || article.title}
            decoding="async"
            priority={true}
            className="rounded-lg mt-2 md:mt-6 w-full h-auto object-cover"
          />
        </div>
      )}
      
      <main className="min-h-screen p-2 md:p-8 max-w-4xl mx-auto">
        <article className="card rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 accent-heading">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
            
            {article.category && (
              <div className="flex items-center">
                <span className="font-medium">Категория:</span>
                <Link 
                  href={`/categories/${article.category.slug}`}
                  className="white-to-orange ml-1"
                >
                  {article.category.name}
                </Link>
              </div>
            )}
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center">
                <span className="font-medium">Теги:</span>
                <div className="ml-1 flex flex-wrap gap-1">
                  {article.tags.map((tag, index) => (
                    <span key={tag.id}>
                      <Link 
                        href={`/tags/${tag.slug}`}
                        className="hover:underline"
                      >
                        {tag.name}
                      </Link>
                      {index < article.tags.length - 1 && ', '}
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
            <BlocksRenderer content={article.content} />
          </div>

          {article.youtube && (
            <div className="mt-8">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${article.youtube}`}
                  title={`«${article.title}»`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-96 rounded-lg"
                ></iframe>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">

          <div className="text-xs mt-2 opacity-60">
            Опубликовано: {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
          </div>

          <ShareButtons url={articleUrl} title={article.title} />

          </div>
        </article>

        {/* Блок поддержки проекта */}
        <SupportProjectBlock />

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

        <CommentsSection contentType="articles" contentSlug={slug} />
        
      </main>
    </div>
  );
}