// /src/app/gta-online/shark-cards/page.tsx

import Image from 'next/image';
import Link from 'next/link';

const sharkCards = [
  {
    id: 1,
    title: 'MEGALODON SHARK CASH CARD 8,000,000$',
    price: '6 899 ₽',
    image: '/shark-cards/megalodon.webp',
    link: 'https://plati.market/itm/gta-online-megalodon-shark-cash-card-8-000-000-pc/3590684?ai=901800'
  },
  {
    id: 2,
    title: 'WHALE SHARK CASH CARD 3,500,000$',
    price: '4 595 ₽',
    image: '/shark-cards/whale.webp',
    link: 'https://plati.market/itm/gta-online-whale-shark-cash-card-3-500-000-pc-key/3590689?ai=901800'
  },
  {
    id: 3,
    title: 'GREAT WHITE SHARK CASH 1,250,000$',
    price: '1 599 ₽',
    image: '/shark-cards/great-white.webp',
    link: 'https://plati.market/itm/gta-online-great-white-shark-cash-1-250-000-pc-key/3590685?ai=901800'
  },
  {
    id: 4,
    title: 'BULL SHARK CASH CARD 500,000$',
    price: '899 ₽',
    image: '/shark-cards/bull.webp',
    link: 'https://plati.market/itm/gta-online-bull-shark-cash-card-500-000-pc-key/3590687?ai=901800'
  },
  {
    id: 5,
    title: 'TIGER SHARK CASH CARD 200,000$',
    price: '395 ₽',
    image: '/shark-cards/tiger.webp',
    link: 'https://plati.market/itm/gta-online-tiger-shark-cash-card-200-000-pc-key/2451493?ai=901800'
  },
  {
    id: 6,
    title: 'RED SHARK CASH CARD 100,000$',
    price: '195 ₽',
    image: '/shark-cards/red.webp',
    link: 'https://plati.market/itm/gta-online-red-shark-cash-card-100-000-pc-key/3590686?ai=901800'
  }
];

export default function SharkCardsPage() {
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
              <span className="text-rockstar-500 font-medium">Shark Cards</span>
            </li>
          </ol>
        </nav>

        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Shark Cards — купить за реальные деньги</h1>
          <p className="text-gray-500 text-medium">
            Купить Shark Cards для GTA Online. Официальные карты с мгновенной доставкой. Легальный способ получения GTA$.
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sharkCards.map((card) => (
            <a 
              key={card.id}
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group outline-2 outline-offset-2 outline-zinc-800 hover:outline-rockstar-500 block"
            >
              <div className="w-full h-full card flex items-center justify-center">
                <span className="text-gray-500">Изображение Shark Card</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-10">
                <h3 className="text-white font-semibold text-lg line-clamp-2 mb-2">
                  {card.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-rockstar-500 font-bold text-xl">{card.price}</span>
                  <span className="bg-rockstar-500 text-white px-3 py-1 rounded text-sm font-medium">
                    Купить
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* SEO описание */}
        <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
          <h2 className="mb-2">Shark Cards — официальный способ покупки GTA$</h2>
          
          <p>
            Shark Cash Cards — это полностью легальный и официальный способ приобретения внутриигровой валюты GTA$ 
            в GTA Online. В отличие от различных серых схем и читерских методов, покупка Shark Cards гарантирует 
            безопасность вашего аккаунта и сохранность прогресса.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-yellow-700 font-medium">Важное предупреждение</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Другие, зачастую более дешевые варианты накрутки валюты GTA$ и опыта — это читы, 
                  за которые рано или поздно прилетит бан. Не верьте продавцам, которые обещают 
                  &ldquo;безопасные&rdquo; неофициальные методы пополнения счета.
                </p>
              </div>
            </div>
          </div>

          <h3>Преимущества покупки Shark Cards</h3>
          <ul>
            <li><strong>Полная легальность</strong> — официальный товар от Rockstar Games</li>
            <li><strong>Мгновенная доставка</strong> — ключ приходит сразу после оплаты</li>
            <li><strong>Безопасность аккаунта</strong> — никакого риска блокировки</li>
            <li><strong>Простая активация</strong> — через Rockstar Games Social Club</li>
          </ul>

          <h3 className="mb-2">Информация о продавце</h3>
          <div className="card p-4 rounded mt-4 mb-4">
            <p><strong>mrakk</strong></p>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div>Рейтинг: <span className="font-semibold">24 978 отзывов</span></div>
              <div>На маркетплейсе: <span className="font-semibold">13 лет</span></div>
              <div>Положительных оценок: <span className="font-semibold">24 974</span></div>
              <div>Негативных оценок: <span className="font-semibold">4</span></div>
              <div>Количество продаж: <span className="font-semibold">1 025 119</span></div>
            </div>
          </div>

          <h3 className="mb-2">Как активировать Shark Card?</h3>
          <ol>
            <li>Оплатите выбранную карту</li>
            <li>Получите ключ на email или в браузере</li>
            <li>Активируйте на сайте: https://socialclub.rockstargames.com/activate</li>
            <li>Деньги поступят на счет вашего персонажа в GTA Online</li>
          </ol>

          <p className="text-sm text-gray-600 mt-6">
            <strong>Внимание!</strong> Для использования требуется игра Grand Theft Auto V или Grand Theft Auto Online. 
            Карты не имеют региональных ограничений и активируются во всех странах.
          </p>
        </div>
      </div>
    </main>
  );
}