// /src/app/gta-online/shark-cards/page.tsx

import Image from 'next/image';
import Link from 'next/link';

const sharkCards = [
  {
    id: 1,
    title: 'Megalodon Shark Cash Card',
    value: '8,000,000$',
    price: '6 899 ₽',
    image: '/Megalodon.jpg',
    link: 'https://plati.market/itm/gta-online-megalodon-shark-cash-card-8-000-000-pc/3590684?ai=901800'
  },
  {
    id: 2,
    title: 'Whale Shark Cash Card',
    value: '3,500,000$',
    price: '4 595 ₽',
    image: '/WhaleShark.jpg',
    link: 'https://plati.market/itm/gta-online-whale-shark-cash-card-3-500-000-pc-key/3590689?ai=901800'
  },
  {
    id: 3,
    title: 'Great White Shark Cash Card',
    value: '1,250,000$',
    price: '1 599 ₽',
    image: '/GreatWhite.jpg',
    link: 'https://plati.market/itm/gta-online-great-white-shark-cash-1-250-000-pc-key/3590685?ai=901800'
  },
  {
    id: 4,
    title: 'Bull Shark Cash Card',
    value: '500,000$',
    price: '899 ₽',
    image: '/BullShark.jpg',
    link: 'https://plati.market/itm/gta-online-bull-shark-cash-card-500-000-pc-key/3590687?ai=901800'
  },
  {
    id: 5,
    title: 'Tiger Shark Cash Card',
    value: '200,000$',
    price: '395 ₽',
    image: '/TigerShark.jpg',
    link: 'https://plati.market/itm/gta-online-tiger-shark-cash-card-200-000-pc-key/2451493?ai=901800'
  },
  {
    id: 6,
    title: 'Red Shark Cash Card',
    value: '100,000$',
    price: '195 ₽',
    image: '/RedShark.jpg',
    link: 'https://plati.market/itm/gta-online-red-shark-cash-card-100-000-pc-key/3590686?ai=901800'
  }
];

export default function SharkCardsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

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
              <span className="text-rockstar-500 font-medium">Купить Shark Cards</span>
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Shark Cards — купить валюту GTA Online</h1>
          <p className="text-gray-500 text-medium">
            Купить Shark Cards для GTA Online. Официальные ваучеры с мгновенной доставкой. Легальный и безопасный способ получения GTA$. Активация в Rockstar Games Launcher или на сайте Social Club.
          </p>
        </div>

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
                <h3 className="text-white font-semibold text-lg line-clamp-2 mb-1">
                  {card.value}
                </h3>
                <h4 className="text-gray-300 font-medium text-sm line-clamp-2 mb-2">
                  {card.title}
                </h4>
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

        <div className="prose max-w-none card p-6 rounded-lg article-content">
          <h2 className="mt-0">Shark Cards — официальный способ покупки GTA$</h2>
          
          <p>
            Shark Cash Cards — это полностью <strong>легальный</strong> и официальный способ приобретения внутриигровой валюты <strong>GTA$</strong>&nbsp;в <Link href="https://rockstarhub.ru/games/gtao" className="orange-to-white">GTA Online</Link>. В отличие от различных серых схем и читерских методов, покупка Shark Cards <strong>гарантирует 
            безопасность</strong> вашего аккаунта и сохранность прогресса.
          </p>

          <div className="border-l-4 border-yellow-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-yellow-700 font-medium">Важное предупреждение</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Другие, зачастую более дешевые варианты накрутки валюты GTA$ и опыта — это читы, и нарушение <a href="https://www.rockstargames.com/legal?country=ru" target="_blank" rel="noopener noreferrer" className="orange-to-white">пользовательского соглашения</a>,
                  за что рано или поздно прилетит бан. Не верьте продавцам, которые обещают 
                  «безопасные» неофициальные методы пополнения счета.
                </p>
              </div>
            </div>
          </div>

          <h3>Преимущества покупки Shark Cards</h3>
          <ul className="mb-2">
            <li><strong>Полная легальность</strong> — официальный товар от Rockstar Games</li>
            <li><strong>Мгновенная доставка</strong> — ключ приходит сразу после оплаты</li>
            <li><strong>Безопасность аккаунта</strong> — никакого риска блокировки или потери прогресса</li>
            <li><strong>Простая активация</strong> — через Rockstar Games Launcher или Social Club</li>
          </ul>

          <h3>Надёжный продавец</h3>
          <div className="card p-4 rounded mt-4 mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div>Отзывы: <span className="font-semibold">24 978+</span></div>
              <div>На маркетплейсе: <span className="font-semibold">13 лет</span></div>
              <div>Положительных оценок: <span className="font-semibold">24 974+</span></div>
              <div>Негативных оценок: <span className="font-semibold">4</span></div>
              <div>Количество продаж: <span className="font-semibold">1 025 119+</span></div>
              <div>Уровень продавца: <span className="font-semibold">Сертифицированный</span></div>
            </div>
          </div>

          <h3>Как активировать Shark Card?</h3>
          <ul className="mb-2">
            <li>Оплатите выбранную карту</li>
            <li>Получите ключ на email указанный при покупке</li>
            <li>Запустите <strong>Rockstar Games Launcher</strong>, и нажмите на аватар справа сверху</li>
            <li>Выберите пункт «<strong>Использовать код</strong>» и введите код активации</li>
            <li>Деньги поступят на счет вашего персонажа в GTA Online</li>
          </ul>

          <p className="mt-6">Если при активации в <strong>RGL</strong> возникли проблемы - активируйте код на сайте <a href="https://socialclub.rockstargames.com/activate" target="_blank" rel="noopener noreferrer" className="orange-to-white">Social Club</a>.</p>

          <p className="text-sm text-gray-600 mt-4">
            <strong>Внимание!</strong> Для использования требуется игра <strong>Grand Theft Auto Online</strong>. 
            Ваучеры не имеют региональных ограничений и активируются во всех странах.
          </p>
        </div>
      </div>
    </main>
  );
}