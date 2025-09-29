// /src/app/gta-online/weekly/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

import { 
  TwitterShareButton, 
  VKShareButton, 
  TelegramShareButton,
  TwitterIcon,
  VKIcon,
  TelegramIcon
} from 'react-share';

interface Event {
  id: number;
  title: string;
  is_double: boolean;
  content: any[];
  coverImage: {
    id: number;
    url: string;
    formats: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

interface EventData {
  id: number;
  title: string;
  week_start: string;
  week_end: string;
  event: Event[];
}

interface ApiResponse {
  data: EventData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export default function EventsPage() {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Блокировка прокрутки фона при открытом модальном окне
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/weeklies`);
        url.searchParams.set('populate[event][populate][0]', 'coverImage');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data && response.data.data.length > 0) {
          // Берем последний элемент массива data (самый свежий)
          const latestData = response.data.data[0];
          setEventData(latestData);
        } else {
          setError('События не найдены');
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError('Не удалось загрузить события');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventData();
  }, []);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const renderContent = (content: any[]) => {
    if (!content || !Array.isArray(content)) return null;

    return content.map((item, index) => {
      if (item.type === 'paragraph') {
        return (
          <p key={index} className="mb-4">
            {item.children.map((child: any, childIndex: number) => {
              if (child.bold) {
                return <strong key={childIndex} className="font-bold">{child.text}</strong>;
              }
              return <span key={childIndex}>{child.text}</span>;
            })}
          </p>
        );
      }
      
      if (item.type === 'heading' && item.level === 3) {
        const headingText = item.children.map((child: any) => child.text).join('');
        return (
          <h3 key={index} className="text-xl font-bold mb-3 mt-6">
            {headingText}
          </h3>
        );
      }
      
      return null;
    });
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

  if (!eventData && !loading) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 text-center">События не найдены</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">GTA Online — События и бонусы этой недели</h1>
        </div>

        {/* Описание страницы */}
        <div className="w-full mb-8">
          <p className="text-gray-500 text-medium">
            Игровые события GTA Online текущей недели: Скидки на транспорт, оружие и недвижимость. Все доступные бонусы 2X к RP и GTA$.
          </p>
        </div>

        {/* Заголовок и даты - обновленная версия для мобильных */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
          <h2 className="text-medium font-bold">
            {loading ? 'Загрузка...' : eventData?.title || 'События'}
          </h2>
          {eventData && (
            <div className="font-medium text-sm">
              Активно с {formatDate(eventData.week_start)} до {formatDate(eventData.week_end)}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventData?.event?.map((event) => {
              const imageFormats = event.coverImage?.formats || {};
              const imageUrl = imageFormats.large?.url || imageFormats.medium?.url || 
                             imageFormats.small?.url || event.coverImage?.url;

              return (
                <div 
                  key={event.id} 
                  className="aspect-square relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                  onClick={() => openModal(event)}
                >
                  {imageUrl ? (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND}${imageUrl}`}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Нет изображения</span>
                    </div>
                  )}
                  
                  {event.is_double && (
                    <div className="absolute top-3 left-3 bg-white text-black px-2 py-1 rounded-md text-xl font-bold z-10">
                      2X GTA$ + 2X RP
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-10">
                    <h3 className="text-white font-semibold text-lg line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && selectedEvent && (
        <div 
          className="fixed inset-0 card flex items-center justify-center z-50 p-4 bg-black/80"
          onClick={closeModal}
        >
          <div 
            className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-transform duration-300 ease-out animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold pr-4">{selectedEvent.title}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                {selectedEvent.content && Array.isArray(selectedEvent.content) && 
                 renderContent(selectedEvent.content)}
              </div>
            </div>
            
            <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 mr-2 hidden sm:inline">Поделиться:</span>
                <TwitterShareButton
                  url="https://rockstarhub.ru/gta-online-weekly"
                  title={selectedEvent.title}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <VKShareButton
                  url="https://rockstarhub.ru/gta-online-weekly"
                  title={selectedEvent.title}
                  image={selectedEvent.coverImage ? `${process.env.NEXT_PUBLIC_BACKEND}${selectedEvent.coverImage.url}` : ''}
                  className="transition-transform duration-400 hover:-translate-y-[2px]"
                >
                  <VKIcon size={32} round />
                </VKShareButton>
                <TelegramShareButton
                  url="https://rockstarhub.ru/gta-online-weekly"
                  title={selectedEvent.title}
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
    </main>
  );
}