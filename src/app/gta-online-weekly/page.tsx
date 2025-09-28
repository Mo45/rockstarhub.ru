// /src/app/gta-online-weekly/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

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

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/articles`);
        url.searchParams.set('populate', '*');
        url.searchParams.set('sort[0]', 'createdAt:desc');
        
        const response = await axios.get<ApiResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        });
        
        if (response.data && response.data.data && response.data.data.length > 0) {
          // Берем первую статью из списка (последнюю опубликованную)
          setEventData(response.data.data[0]);
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
        return (
          <h3 key={index} className="text-xl font-bold mb-3 mt-6">
            {item.children.map((child: any, childIndex: number) => child.text).join('')}
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
          <h1 className="text-xl md:text-2xl font-bold">
            {loading ? 'Загрузка...' : eventData?.title || 'События'}
          </h1>
          {eventData && (
            <div className="font-medium text-sm">
              С {formatDate(eventData.week_start)} до {formatDate(eventData.week_end)}
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
                  
                  {/* Бейдж для событий с удвоенными наградами */}
                  {event.is_double && (
                    <div className="absolute top-3 left-3 bg-white text-black px-2 py-1 rounded-md text-xs font-bold z-10">
                      2X GTA$ + 2X RP
                    </div>
                  )}
                  
                  {/* Оверлей с названием */}
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

      {/* Модальное окно */}
      {isModalOpen && selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold pr-4">{selectedEvent.title}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                {selectedEvent.content && renderContent(selectedEvent.content)}
              </div>
            </div>
            
            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
              <button 
                onClick={closeModal}
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
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