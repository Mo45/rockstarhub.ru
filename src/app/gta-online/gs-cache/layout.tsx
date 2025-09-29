// /src/app/gta-online/gs-cache/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Заначки Джеральда (G\'s Caches) в GTA Online',
  description: 'Полное руководство по поиску заначек Джеральда в GTA Online. Все локации, места появления и советы по сбору.',
  keywords: ['GTA Online', 'Заначки Джеральда', 'G\'s Caches', 'Los Santos Drug Wars', 'тайники'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online/gs-cache'
  },
  openGraph: {
    title: 'Заначки Джеральда (G\'s Caches) в GTA Online',
    description: 'Полное руководство по поиску заначек Джеральда в GTA Online. Все локации, места появления и советы по сбору.',
    type: 'website',
    url: 'https://rockstarhub.ru/gta-online/gs-cache',
    siteName: 'Rockstar Хаб',
  },
};

export default function GSCacheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}