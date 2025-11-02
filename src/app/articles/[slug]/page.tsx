// /src/app/articles/[slug]/page.tsx

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
import CommentsSection from '@/components/comments/CommentsSection';
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

interface SimilarArticle {
  id: number;
  title: string;
  slug: string;
  coverImage?: {
    url: string;
    alternativeText?: string;
    formats?: {
      small: { url: string };
      thumbnail: { url: string };
    };
  };
}

async function getSimilarArticles(categoryId: number, currentArticleId: number, limit: number = 3): Promise<SimilarArticle[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/articles?filters[category][id][$eq]=${categoryId}&filters[id][$ne]=${currentArticleId}&pagination[limit]=${limit}&populate=coverImage&sort[0]=publishedAt:desc`
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Ошибка загрузки похожих статей:', error);
    return [];
  }
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

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/articles?filters[slug][$eq]=${slug}&populate=*`
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
  // Средняя скорость чтения: 140 слов в минуту
  // Средняя длина слова: 5 символов (для русского языка)
  const wordsCount = charactersCount / 5;
  const readingTime = Math.ceil(wordsCount / 140);
  
  // Гарантируем минимум 1 минуту
  return Math.max(1, readingTime);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Статья не найдена - Rockstar Хаб',
    };
  }
  
  return generateSEOMetadata({
    title: article.title,
    description: article.excerpt,
    imageUrl: article.coverImage?.url,
    url: `/articles/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    author: article.author?.name,
    section: article.category?.name,
    tags: article.tags?.map(tag => tag.name),
  });
}

export async function generateStaticParams() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/articles?fields[0]=slug`
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
  const article = await getArticle(slug);
  
  if (!article) {
    notFound();
  }
  
  let authorWithAvatar: Author | null = null;
  if (article.author && article.author.name) {
    authorWithAvatar = await getAuthor(article.author.name);
  }

  let similarArticles: SimilarArticle[] = [];
  if (article.category && article.category.id) {
    similarArticles = await getSimilarArticles(article.category.id, article.id, 3);
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
            loading="lazy"
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

        {similarArticles.length > 0 && (
        <div className="card rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6 accent-heading">Похожие статьи</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarArticles.map((similarArticle) => (
              <Link 
                key={similarArticle.id} 
                href={`/articles/${similarArticle.slug}`}
                className="block hover:no-underline"
              >
                <div className="card similar-card">
                  {similarArticle.coverImage && (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${similarArticle.coverImage.formats?.small?.url || similarArticle.coverImage.formats?.thumbnail?.url || similarArticle.coverImage.url}`} 
                      alt={similarArticle.coverImage.alternativeText || similarArticle.title}
                      decoding="async"
                      loading="lazy"
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
                      {similarArticle.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

        <CommentsSection contentType="articles" contentSlug={slug} />
        
      </main>
    </div>
  );
}