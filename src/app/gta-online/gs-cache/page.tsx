// /src/app/gta-online/gs-cache/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import './styles.css';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { 
  TwitterShareButton, 
  VKShareButton, 
  TelegramShareButton,
  TwitterIcon,
  VKIcon,
  TelegramIcon
} from 'react-share';

interface ImageData {
  id: number;
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

interface CacheItem {
  id: number;
  location_en: string;
  location_ru: string;
  map_far: ImageData;
  map_close: ImageData;
  stash_locations: ImageData[];
}

interface Award {
  id: number;
  description: string;
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  title_en: string;
  title_ru: string;
  image: ImageData;
}

interface GSCacheData {
  id: number;
  title: string;
  title_en: string;
  title_ru: string;
  content: any[];
  cache: CacheItem[];
  image?: ImageData;
  Award?: Award;
}

interface ApiResponse {
  data: GSCacheData;
}

export default function GSCachePage() {
  const [gsCacheData, setGSCacheData] = useState<GSCacheData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCache, setSelectedCache] = useState<CacheItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Блокировка прокрутки фона при открытых модальных окнах
  useEffect(() => {
    if (isModalOpen || isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isLightboxOpen]);

  useEffect(() => {
    const fetchGSCacheData = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/gs-cache`);
        url.searchParams.set('populate[Award][populate][0]', 'image');
        url.searchParams.set('populate[cache][populate]', '*');
        url.searchParams.set('populate', 'image');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data) {
          setGSCacheData(response.data.data);
        } else {
          setError('Данные не найдены');
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGSCacheData();
  }, []);

  const openModal = (cache: CacheItem) => {
    setSelectedCache(cache);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCache(null);
  };

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(`${process.env.NEXT_PUBLIC_BACKEND}${imageUrl}`);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImage(null);
  };

  if (error) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 text-red-500 text-center">Ошибка: {error}</div>
        </div>
      </main>
    );
  }

  if (!gsCacheData && !loading) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 text-center">Данные не найдены</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            {loading ? 'Загрузка...' : gsCacheData?.title}
          </h1>
          
          {/* Изображение пакета */}
          <div className="flex items-center mb-4">
            <Image 
              src="/GTAO_Dead_Drop_Package.webp"
              alt="Заначка Джеральда"
              width={64}
              height={64}
              className="mr-2"
            />
            <div>
              <h2 className="text-lg text-gray-300">{gsCacheData?.title_ru}</h2>
              <h2 className="text-lg text-gray-400">{gsCacheData?.title_en}</h2>
            </div>
          </div>
        </div>

        {/* Основное изображение */}
        {gsCacheData?.image && (
          <div className="mb-8">
            <Image 
              src={`${process.env.NEXT_PUBLIC_BACKEND}${gsCacheData.image.url}`}
              alt={gsCacheData.title}
              width={1920}
              height={1080}
              className="w-full h-auto rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>
        )}

        {/* Контент статьи */}
        {gsCacheData?.content && (
          <article className="card rounded-lg p-6 md:p-8 mb-8">
            <div className="prose prose-lg max-w-none article-content">
              <BlocksRenderer content={gsCacheData.content} />
            </div>
          </article>
        )}

        {/* Сетка карточек с кэшами */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gsCacheData?.cache?.map((cache) => {
              const imageFormats = cache.map_far?.formats || {};
              const imageUrl = imageFormats.large?.url || imageFormats.medium?.url || 
                             imageFormats.small?.url || cache.map_far?.url;

              return (
                <div 
                  key={cache.id} 
                  className="aspect-square relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500"
                  onClick={() => openModal(cache)}
                >
                  {imageUrl ? (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${imageUrl}`}
                      alt={`${cache.location_ru} - ${cache.location_en}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Нет изображения</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-10">
                    <h3 className="text-white font-semibold text-lg">
                      {cache.location_ru}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {cache.location_en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Секция с наградой */}
        {gsCacheData?.Award && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Награда</h2>
            <div className="card rounded-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Изображение награды */}
                {gsCacheData.Award.image && (
                  <div className="flex-shrink-0">
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${gsCacheData.Award.image.url}`}
                      alt={gsCacheData.Award.title_en}
                      width={210}
                      height={210}
                      className="rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  {/* Названия награды */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white">{gsCacheData.Award.title_en}</h3>
                    <h4 className="text-lg text-gray-300">{gsCacheData.Award.title_ru}</h4>
                  </div>
                  
                  {/* Описание награды */}
                  <p className="text-gray-300 mb-6">{gsCacheData.Award.description}</p>
                  
                  {/* Требования уровней */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-zinc-800 rounded-lg">
                      <div className="text-2xl font-bold text-amber-800">{gsCacheData.Award.bronze}</div>
                      <div className="text-sm text-gray-300 mt-2">Бронза +100 RP</div>
                    </div>
                    <div className="text-center p-4 bg-zinc-800 rounded-lg">
                      <div className="text-2xl font-bold text-zinc-500">{gsCacheData.Award.silver}</div>
                      <div className="text-sm text-gray-300 mt-2">Серебро +200 RP</div>
                    </div>
                    <div className="text-center p-4 bg-zinc-800 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{gsCacheData.Award.gold}</div>
                      <div className="text-sm text-gray-300 mt-2">Золото +400 RP</div>
                    </div>
                    <div className="text-center p-4 bg-zinc-800 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-300">{gsCacheData.Award.platinum}</div>
                      <div className="text-sm text-gray-300 mt-2">Платина +800 RP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Модальное окно с деталями кэша */}
      {isModalOpen && selectedCache && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/80"
          onClick={closeModal}
        >
          <div 
            className="bg-zinc-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden transform transition-transform duration-300 ease-out animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <Image 
                    src="/GTAO_Dead_Drop_Package.webp"
                    alt="Заначка Джеральда"
                    width={64}
                    height={64}
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCache.location_ru}</h2>
                    <p className="text-gray-400">{selectedCache.location_en}</p>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              
              {/* Map Far */}
              {selectedCache.map_far && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Общий вид на карте</h3>
                  <div 
                    className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(selectedCache.map_far.url)}
                  >
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${selectedCache.map_far.url}`}
                      alt={`${selectedCache.location_ru} - общий вид`}
                      fill
                      className="object-cover hover:scale-105 transition-all duration-300 outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                  </div>
                </div>
              )}

              {/* Map Close */}
              {selectedCache.map_close && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Приближенный вид</h3>
                  <div 
                    className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(selectedCache.map_close.url)}
                  >
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${selectedCache.map_close.url}`}
                      alt={`${selectedCache.location_ru} - приближенный вид`}
                      fill
                      className="object-cover hover:scale-105 transition-all duration-300 outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                  </div>
                </div>
              )}

              {/* Stash Locations */}
              {selectedCache.stash_locations && selectedCache.stash_locations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Возможные места расположения заначки:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {selectedCache.stash_locations.map((stashImage, index) => (
                      <div 
                        key={stashImage.id}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500"
                        onClick={() => openLightbox(stashImage.url)}
                      >
                        <Image 
                          src={`${process.env.NEXT_PUBLIC_BACKEND}${stashImage.url}`}
                          alt={`Место расположения ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Кнопки поделиться и закрыть */}
            <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 mr-2 hidden sm:inline">Поделиться:</span>
                <TwitterShareButton
                  url="https://rockstarhub.ru/gta-online/gs-cache"
                  title={`Заначка Джеральда: ${selectedCache.location_ru}`}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <VKShareButton
                  url="https://rockstarhub.ru/gta-online/gs-cache"
                  title={`Заначка Джеральда: ${selectedCache.location_ru}`}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <VKIcon size={32} round />
                </VKShareButton>
                <TelegramShareButton
                  url="https://rockstarhub.ru/gta-online/gs-cache"
                  title={`Заначка Джеральда: ${selectedCache.location_ru}`}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
              </div>
              <button 
                onClick={closeModal}
                className="button-orange"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Лайтбокс для изображений */}
      {isLightboxOpen && lightboxImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[60] bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-5xl max-h-full">
            <Image 
              src={lightboxImage}
              alt="Увеличенное изображение"
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 transition-colors duration-200"
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}