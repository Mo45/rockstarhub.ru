// /src/components/ArticleList.tsx

"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image'
import { TbFolderFilled, TbCalendarWeek } from 'react-icons/tb';

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
  squareImage: any;
  author: any;
  category: any;
  tags: any[];
  backGroundImg?: any;
  backGroundHex?: string;
  accentHex?: string;
}

interface ApiResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface ArticleListProps {
  limit?: number;
}

export default function ArticleList({ limit = 12 }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/articles`);
        url.searchParams.set('populate', '*');
        url.searchParams.set('sort[0]', 'createdAt:desc');
        url.searchParams.set('pagination[pageSize]', limit.toString());
        url.searchParams.set('pagination[page]', '1');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data) {
          setArticles(response.data.data);
        } else {
          setError('Ошибка API');
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError('Не удалось загрузить статьи');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [limit]);

  if (error) {
    return <div className="p-4 text-red-500">Ошибка: {error}</div>;
  }

  if (articles.length === 0 && !loading) {
    return <div className="p-4">Статьи не найдены</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        [...Array(Math.min(limit, 12))].map((_, i) => (
          <div key={i} className="card article-list-card animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-4 h-full flex flex-col">
              <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md mb-4 w-2/3"></div>
              <div className="article-meta flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded-md w-1/4"></div>
              </div>
            </div>
          </div>
        ))
      ) : (
        articles.map((article) => {
          const image = article.squareImage || article.coverImage;
          const imageFormats = image?.formats || {};
          
          return (
            <div key={article.id} className="card article-list-card">
              <Link href={`/articles/${article.slug}`} className="block h-full">
                {image && (
                  <div className="w-full relative">
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${imageFormats.large?.url || image.url}`}
                      alt={image.alternativeText || article.title}
                      placeholder="blur"
                      blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAACP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKaAD5AP/9k='
                      className="w-full h-full object-cover"
                      width={1000}
                      height={1000}
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
        })
      )}
    </div>
  );
}