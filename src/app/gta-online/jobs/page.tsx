// /src/app/gta-online/jobs/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaUsers } from "react-icons/fa";

interface Job {
  id: number;
  title_ru: string;
  title_en: string;
  slug: string;
  players: string;
  series_title_ru: string;
  job_image: {
    id: number;
    url: string;
    formats: {
      thumbnail?: { url: string };
    };
  };
}

interface ApiResponse {
  data: Job[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/jobs`);
        url.searchParams.set('populate[0]', 'job_image');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data) {
          setJobs(response.data.data);
        } else {
          setError('Дела не найдены');
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError('Не удалось загрузить список дел');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 text-red-500 text-center">Ошибка: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

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
              <Link href="/gta-online" className="hover:text-gray-700 transition-colors">
                Хаб GTA Online
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-rockstar-500 font-medium">Дела в GTA Online</span>
            </li>
          </ol>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Все дела в GTA Online: полное прохождение, награды и советы</h1>
        </div>

        {/* Описание страницы */}
        <div className="w-full mb-8">
          <p className="text-gray-500 text-medium">
            Дела (Jobs) в GTA Online — это различные миссии, задания и контракты, которые можно выполнять в одиночку или с друзьями. В этом руководстве вы найдете полный список всех дел, пошаговое прохождение, требования и награды за выполнение.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-video bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobs.map((job) => {
              const imageUrl = job.job_image?.formats?.thumbnail?.url || job.job_image?.url;

              return (
                <Link 
                  key={job.id} 
                  href={`/gta-online/jobs/${job.slug}`}
                  className="aspect-video relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500 block"
                >
                  {imageUrl ? (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${imageUrl}`}
                      alt={job.title_ru}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Нет изображения</span>
                    </div>
                  )}
                  
                  {/* Плашка с названием серии */}
                  <div className="absolute top-3 left-3 bg-rockstar-500 text-black px-2 py-1 rounded-md text-sm font-bold z-10">
                    {job.series_title_ru}
                  </div>
                  
                  {/* Плашка с количеством игроков */}
                  <div className="absolute top-3 right-3 bg-rockstar-500 text-black px-2 py-1 rounded-md text-sm font-bold z-10">
                    <FaUsers className="inline"/> {job.players}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-10">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {job.title_ru}
                    </h3>
                    <h4 className="text-gray-300 text-sm">
                      {job.title_en}
                    </h4>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}