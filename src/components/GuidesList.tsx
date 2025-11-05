// /src/components/GuidesList.tsx

"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image'
import { TbFolderFilled, TbCalendarWeek } from 'react-icons/tb';

interface Guide {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  squareImage: any;
  game_name: string;
  game_url: string;
}

interface ApiResponse {
  data: Guide[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface GuidesListProps {
  limit?: number;
}

export default function GuidesList({ limit = 12 }: GuidesListProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/guides`);
        url.searchParams.set('populate[0]', 'squareImage');
        url.searchParams.set('sort[0]', 'createdAt:desc');
        url.searchParams.set('pagination[pageSize]', limit.toString());
        url.searchParams.set('pagination[page]', '1');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data) {
          setGuides(response.data.data);
        } else {
          setError('Ошибка API');
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError('Не удалось загрузить руководства');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuides();
  }, [limit]);

  if (error) {
    return <div className="p-4 text-red-500">Ошибка: {error}</div>;
  }

  if (guides.length === 0 && !loading) {
    return <div className="p-4">Руководства не найдены</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        [...Array(Math.min(limit, 12))].map((_, i) => (
          <div key={i} className="card guides-list-card animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-4 h-full flex flex-col">
              <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md mb-4 w-2/3"></div>
              <div className="guides-meta flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded-md w-1/4"></div>
              </div>
            </div>
          </div>
        ))
      ) : (
        guides.map((guide) => {
          const image = guide.squareImage;
          const imageFormats = image?.formats || {};
          
          return (
            <div key={guide.id} className="card guides-list-card">
              <Link href={`/guides/${guide.slug}`} className="block h-full">
                {image && (
                  <div className="w-full relative">
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${imageFormats.large?.url || image.url}`}
                      alt={image.alternativeText || guide.title}
                      placeholder="blur"
                      blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdQAq//9k='
                      className="w-full h-full object-cover"
                      width={1000}
                      height={1000}
                    />
                  </div>
                )}
                <div className="p-4 h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-2 line-clamp-3">
                    {guide.title || 'Без названия'}
                  </h2>
                  <p className="guide-excerpt text-sm text-gray-600 mb-4 line-clamp-3">
                    {guide.excerpt || ''}
                  </p>
                  <div className="guide-meta flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <TbCalendarWeek className="w-3 h-3" />
                      <span>{new Date(guide.publishedAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                    {guide.game_name && (
                      <div className="flex items-center gap-1">
                        <TbFolderFilled className="w-3 h-3" />
                        <span>{guide.game_name}</span>
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