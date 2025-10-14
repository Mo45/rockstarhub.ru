// /src/app/gta-online/cayo-perico-treasure-chests/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сокровища Кайо-Перико (Treasure Chests) в GTA Online',
  description: 'Полное руководство по поиску сундуков с сокровищами на острове Кайо-Перико в GTA Online. Все локации, карты и советы по сбору.',
  keywords: ['GTA Online', 'Сокровища Кайо-Перико', 'Treasure Chests', 'Cayo Perico Heist', 'сундуки'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online/cayo-perico-treasure-chests'
  },
  openGraph: {
    title: 'Сокровища Кайо-Перико (Treasure Chests) в GTA Online',
    description: 'Полное руководство по поиску сундуков с сокровищами на острове Кайо-Перико в GTA Online. Все локации, карты и советы по сбору.',
    type: 'website',
    url: 'https://rockstarhub.ru/gta-online/cayo-perico-treasure-chests',
    siteName: 'Rockstar Хаб',
  },
};

export default function TreasureChestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}