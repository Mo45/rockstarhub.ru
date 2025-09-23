// /src/app/search/SearchResults.tsx

"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image'

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImage: any;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchArticles = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/articles?filters[title][$containsi]=${query}&populate=coverImage`
        );
        
        if (response.data && response.data.data) {
          setResults(response.data.data);
        }
      } catch (error) {
        console.error('Ошибка поиска:', error);
      } finally {
        setLoading(false);
      }
    };

    searchArticles();
  }, [query]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Результаты поиска {query && `для "${query}"`}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rockstar-500"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              {query ? 'Ничего не найдено' : 'Введите поисковый запрос'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {results.map((article) => (
              <div key={article.id} className="card rounded-lg overflow-hidden transition-all hover:scale-[1.02]">
                <Link href={`/articles/${article.slug}`} className="block">
                  {article.coverImage && (
                    <div className="w-full h-48 relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND}${article.coverImage.url}`} 
                        alt={article.coverImage.alternativeText || article.title}
                        className="w-full h-48 object-cover"
                        decoding="async"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">
                      {article.title || 'Без названия'}
                    </h2>
                    <p className="mb-3 opacity-80">{article.excerpt || ''}</p>
                    <div className="text-sm opacity-60">
                      Опубликовано: {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}