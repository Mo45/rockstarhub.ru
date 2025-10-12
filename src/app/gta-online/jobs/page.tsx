// /src/app/gta-online/jobs/page.tsx

"use client";

import { useState, useEffect, useMemo } from 'react';
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

// Компонент поиска дел
function SearchJobs({ jobs, searchQuery, setSearchQuery }: { 
  jobs: Job[]; 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
}) {
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    
    const query = searchQuery.toLowerCase();
    return jobs.filter(job => 
      job.title_ru.toLowerCase().includes(query) ||
      job.title_en.toLowerCase().includes(query) ||
      job.series_title_ru.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

  return (
    <div className="w-full mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск дел по названию или серии..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="card w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rockstar-500"
        />
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {filteredJobs.map(job => (
              <Link
                key={job.id}
                href={`/gta-online/jobs/${job.slug}`}
                className="block p-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
              >
                <div className="font-medium text-rockstar-500 hover:text-rockstar-600">{job.title_ru}</div>
                <div className="text-sm text-gray-600">{job.title_en}</div>
                <div className="text-xs text-gray-500 mt-1">{job.series_title_ru}</div>
              </Link>
            ))}
            {filteredJobs.length === 0 && (
              <div className="p-3 text-gray-500">Дела не найдены</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Фильтрация дел для основного списка
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    
    const query = searchQuery.toLowerCase();
    return jobs.filter(job => 
      job.title_ru.toLowerCase().includes(query) ||
      job.title_en.toLowerCase().includes(query) ||
      job.series_title_ru.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

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
          <h1 className="text-xl md:text-2xl font-bold">Все дела в GTA Online: прохождение, требования, награды и советы</h1>
        </div>

        {/* Описание страницы */}
        <div className="w-full mb-8">
          <p className="text-gray-500 text-medium">
            Дела (Jobs) в GTA Online — это различные миссии, задания и контракты, которые можно выполнять в одиночку или с друзьями. На этой странице вы найдете полный список всех дел, пошаговое прохождение, требования и награды за выполнение.
          </p>
        </div>

        {/* Поиск дел */}
        <SearchJobs 
          jobs={jobs} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-video bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Сообщение о результате поиска */}
            {searchQuery && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Найдено дел: <span className="font-semibold">{filteredJobs.length}</span>
                  {searchQuery && (
                    <> по запросу: «<span className="font-semibold">{searchQuery}</span>»</>
                  )}
                </p>
              </div>
            )}

            {/* Сетка карточек */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredJobs.map((job) => {
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
                    
                    {/* Плашка с количеством игроков */}
                    <div className="absolute top-3 right-3 bg-rockstar-500 text-black px-2 py-1 rounded-md text-sm font-bold z-10">
                      <FaUsers className="inline"/> {job.players}
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-10">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {job.title_ru}
                      </h3>
                      <h4 className="text-gray-300 text-xs">
                        {job.title_en}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Сообщение, если ничего не найдено */}
            {filteredJobs.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Дела не найдены</p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-rockstar-500 hover:text-rockstar-600 underline"
                  >
                    Показать все дела
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}