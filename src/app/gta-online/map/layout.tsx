// /src/app/gta-online/map/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Расположение игральных карт в GTA Online: все 54 локации и награды',
  description: 'Интерактивная карта с расположением всех 54 игральных карт в GTA Online. Найдите все карты чтобы получить костюм «Крупный игрок» и бонусные фишки для игры в казино Diamond',
  keywords: ['GTA Online', 'игральные карты', 'карта', 'локации', 'награды', '54 карты'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online/map'
  },
  openGraph: {
    title: 'Расположение игральных карт в GTA Online: все 54 локации и награды',
    description: 'Интерактивная карта с расположением всех 54 игральных карт в GTA Online. Найдите все карты чтобы получить костюм «Крупный игрок» и бонусные фишки для игры в казино Diamond',
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