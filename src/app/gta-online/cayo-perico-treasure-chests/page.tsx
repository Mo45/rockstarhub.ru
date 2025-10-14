// /src/app/gta-online/cayo-perico-treasure-chests/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
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

interface ChestItem {
  id: number;
  num: number;
  location_desc: string;
  map: ImageData;
  screenshot: ImageData;
}

interface TreasureChestData {
  id: number;
  title: string;
  title_en: string;
  title_ru: string;
  content: any[];
  chest: ChestItem[];
  image?: ImageData;
  youtube?: string;
}

interface ApiResponse {
  data: TreasureChestData;
}

export default function TreasureChestPage() {
  const [treasureChestData, setTreasureChestData] = useState<TreasureChestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChest, setSelectedChest] = useState<ChestItem | null>(null);
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
    const fetchTreasureChestData = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/treasure-chest`);
        url.searchParams.set('populate[0]', 'image');
        url.searchParams.set('populate[1]', 'chest.map');
        url.searchParams.set('populate[2]', 'chest.screenshot');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data) {
          setTreasureChestData(response.data.data);
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
    
    fetchTreasureChestData();
  }, []);

  const openModal = (chest: ChestItem) => {
    setSelectedChest(chest);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChest(null);
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

  if (!treasureChestData && !loading) {
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
              <span className="text-rockstar-500 font-medium">Сундуки с сокровищами на Кайо-Перико</span>
            </li>
          </ol>
        </nav>

        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            {loading ? 'Загрузка...' : treasureChestData?.title}
          </h1>
          
          <div>
            <h2 className="text-lg text-gray-300">{treasureChestData?.title_ru}</h2>
            <h2 className="text-lg text-gray-400">{treasureChestData?.title_en}</h2>
          </div>
        </div>

        {/* Основное изображение */}
        {treasureChestData?.image && (
          <div className="mb-8">
            <Image 
              src={`${process.env.NEXT_PUBLIC_BACKEND}${treasureChestData.image.url}`}
              alt={treasureChestData.title}
              width={1920}
              height={1080}
              className="w-full h-auto rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>
        )}

        {/* Контент статьи */}
        {treasureChestData?.content && (
          <article className="card rounded-lg p-6 md:p-8 mb-8">
            <div className="prose prose-lg max-w-none article-content">
              <BlocksRenderer content={treasureChestData.content} />
            </div>
          </article>
        )}

        {/* YouTube видео */}
        {treasureChestData?.youtube && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-8">Как найти все Сундуки с Сокровищами на Кайо-Перико</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${treasureChestData.youtube}`}
                title={`Видео-руководство по поиску сокровищ на Кайо-Перико: ${treasureChestData.title_ru}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-80 rounded-lg"
              ></iframe>
            </div>
          </div>
        )}

        {/* Сетка карточек с сундуками */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treasureChestData?.chest?.map((chest) => {
              const imageFormats = chest.map?.formats || {};
              const imageUrl = imageFormats.large?.url || imageFormats.medium?.url || 
                             imageFormats.small?.url || chest.map?.url;

              return (
                <div 
                  key={chest.id} 
                  className="aspect-square relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500"
                  onClick={() => openModal(chest)}
                >
                  {imageUrl ? (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${imageUrl}`}
                      alt={`Сундук №${chest.num}`}
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
                      № {chest.num}
                    </h3>
                    <p className="text-gray-300 text-xs">
                      {chest.location_desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Модальное окно с деталями сундука */}
      {isModalOpen && selectedChest && (
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
                <div>
                  <h2 className="text-2xl font-bold">Сундук №{selectedChest.num}</h2>
                  <p className="text-gray-400 mt-2">{selectedChest.location_desc}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              
              {/* Карта расположения */}
              {selectedChest.map && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Расположение на карте</h3>
                  <div 
                    className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500"
                    onClick={() => openLightbox(selectedChest.map.url)}
                  >
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${selectedChest.map.url}`}
                      alt={`Сундук №${selectedChest.num} - расположение на карте`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                  </div>
                </div>
              )}

              {/* Скриншот места */}
              {selectedChest.screenshot && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Внешний вид места</h3>
                  <div 
                    className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500"
                    onClick={() => openLightbox(selectedChest.screenshot.url)}
                  >
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${selectedChest.screenshot.url}`}
                      alt={`Сундук №${selectedChest.num} - внешний вид`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Кнопки поделиться и закрыть */}
            <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 mr-2 hidden sm:inline">Поделиться:</span>
                <TwitterShareButton
                  url="https://rockstarhub.ru/gta-online/cayo-perico-treasure-chests"
                  title={`Сундук с сокровищами Кайо-Перико №${selectedChest.num} — ${selectedChest.location_desc}`}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <VKShareButton
                  url="https://rockstarhub.ru/gta-online/cayo-perico-treasure-chests"
                  title={`Сундук с сокровищами Кайо-Перико №${selectedChest.num} — ${selectedChest.location_desc}`}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <VKIcon size={32} round />
                </VKShareButton>
                <TelegramShareButton
                  url="https://rockstarhub.ru/gta-online/cayo-perico-treasure-chests"
                  title={`Сундук с сокровищами Кайо-Перико №${selectedChest.num} — ${selectedChest.location_desc}`}
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