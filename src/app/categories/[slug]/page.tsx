// /src/app/categories/[slug]/page.tsx

import { notFound } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image'
import { TbFolderFilled, TbCalendarWeek } from 'react-icons/tb';
import './category-styles.css';

interface CategoryArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coverImage: any;
  squareImage: any;
  backGroundHex?: string | null;
  accentHex?: string | null;
  category: any;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  articles: CategoryArticle[];
}

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/categories?filters[slug][$eq]=${slug}&populate[articles][populate]=*&sort=createdAt:desc`
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0];
  } catch (error) {
    console.error('Ошибка загрузки категории:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  
  if (!category) {
    return {
      title: 'Категория не найдена - Rockstar Хаб',
    };
  }
  
  return {
    title: `${category.name} - Rockstar Хаб`,
    description: `Новости в категории ${category.name}`,
  };
}

export async function generateStaticParams() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/categories?fields[0]=slug`
    );
    
    return response.data.data.map((category: Category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Ошибка генерации статических параметров:', error);
    return [];
  }
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const category = await getCategory(slug);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {category.name}
        </h1>
        <p className="text-gray-600">
          Статей в этой категории: {category.articles.length}
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.articles.map((article) => {
          const image = article.squareImage || article.coverImage;
          const imageFormats = image?.formats || {};
          
          return (
            <div key={article.id} className="card article-list-card">
              <Link href={`/articles/${article.slug}`} className="block h-full">
                {image && (
                  <div className="w-full relative">
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${imageFormats.large?.url || image.url}`}
                      decoding="async"
                      loading="lazy"
                      alt={image.alternativeText || article.title}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4 h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-2 line-clamp-3" style={{
                    backgroundColor: article.backGroundHex || 'transparent',
                    color: article.accentHex || 'inherit'
                  }}>
                    {article.title || 'Без названия'}
                  </h2>
                  <p className="article-excerpt text-sm text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt || ''}
                  </p>
                  <div className="article-meta flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <TbCalendarWeek className="w-3 h-3" />
                      <span>{new Date(article.publishedAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                    {article.category && (
                      <div className="flex items-center gap-1">
                        <TbFolderFilled className="w-3 h-3" />
                        <span>{article.category.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      
      {category.articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            В этой категории пока нет статей.
          </p>
        </div>
      )}
    </div>
  );
}