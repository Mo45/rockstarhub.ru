// /src/app/gta-online/page.tsx

import Image from 'next/image';
import Link from 'next/link';

const hubCards = [
  {
    id: 1,
    title: 'Заначки Джеральда',
    image: '/gs_cache.webp',
    link: '/gta-online/gs-cache'
  },
  {
    id: 2,
    title: 'События и бонусы этой недели',
    image: '/gta_online_events.webp',
    link: '/gta-online/weekly'
  },
  {
    id: 3,
    title: 'Ограбления',
    image: '/gta_online_heists.webp',
    link: '/gta-online/heists'
  },
  {
    id: 4,
    title: 'Дела',
    image: '/gta_online_jobs.webp',
    link: '/gta-online/jobs'
  }
];

const actionButtons = [
  {
    id: 1,
    title: 'Об игре',
    href: '/games/gtao'
  },
  {
    id: 2,
    title: 'Новости GTA Online',
    href: '/categories/gta-online'
  },
  {
    id: 3,
    title: 'Достижения GTA Online',
    href: '/games/gtao/achievements'
  },
  {
    id: 4,
    title: 'Купить Shark Cards',
    href: '/gta-online/shark-cards'
  }
];

export default function GTAOnlineHub() {
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
              <span className="text-rockstar-500 font-medium">Хаб GTA Online</span>
            </li>
          </ol>
        </nav>

        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Хаб GTA Online</h1>
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