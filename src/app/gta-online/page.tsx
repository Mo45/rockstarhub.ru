// /src/app/gta-online/page.tsx

import Image from 'next/image';
import Link from 'next/link';

const hubCards = [
  {
    id: 1,
    title: 'Заначки Джеральда',
    image: 'https://data.rockstarhub.ru/uploads/gs_cache_f912aa8e59.jpg',
    link: '/gta-online/gs-cache'
  },
  {
    id: 2,
    title: 'События и бонусы этой недели',
    image: 'https://data.rockstarhub.ru/uploads/large_3e513430cff3bae8bbfddee1f5f61274d7832046_925fc0edcc.jpg',
    link: '/gta-online/weekly'
  },
  {
    id: 3,
    title: 'Ограбления',
    image: 'https://data.rockstarhub.ru/uploads/large_Heists_Update_GTAO_Artwork_f0e18561a4.webp',
    link: '/gta-online/heists'
  }
];

const actionButtons = [
  {
    id: 1,
    title: 'Об игре',
    href: 'https://rockstarhub.ru/games/gtao'
  },
  {
    id: 2,
    title: 'Новости',
    href: 'https://rockstarhub.ru/categories/gta-online'
  },
  {
    id: 3,
    title: 'Достижения',
    href: 'https://rockstarhub.ru/games/gtao/achievements'
  }
];

export default function GTAOnlineHub() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">GTA Online — Все разделы</h1>
          <p className="text-gray-500 text-medium">
            Полный гид по GTA Online: еженедельные события, коллекционные предметы, ограбления и многое другое
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-wrap gap-4 mb-8">
          {actionButtons.map((button) => (
            <a
              key={button.id}
              href={button.href}
              className="button-orange"
            >
              {button.title}
            </a>
          ))}
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubCards.map((card) => (
            <Link 
              key={card.id}
              href={card.link}
              className="aspect-square relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500 block"
            >
              {card.image ? (
                <Image 
                  src={card.image}
                  alt={card.title}
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
                <h3 className="text-white font-semibold text-lg line-clamp-2">
                  {card.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}