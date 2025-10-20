// /src/app/gta-online/map/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Карта игральных карт в GTA Online: все 54 локации и награды',
  description: 'Интерактивная карта всех 54 игральных карт в GTA Online. Найдите все карты чтобы получить костюм высокого стола, золотой пистолет и денежные бонусы',
  keywords: ['GTA Online', 'игральные карты', 'карта', 'локации', 'награды', '54 карты'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online/map'
  },
  openGraph: {
    title: 'Карта игральных карт в GTA Online: все 54 локации и награды',
    description: 'Интерактивная карта всех 54 игральных карт в GTA Online. Найдите все карты чтобы получить костюм высокого стола, золотой пистолет и денежные бонусы',
    type: 'website',
    url: 'https://rockstarhub.ru/gta-online/map',
    siteName: 'Rockstar Хаб',
  },
};

export default function GTAOnlineMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}