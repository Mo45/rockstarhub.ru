// /src/app/gta-online/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GTA Online — Полный гид по всем разделам',
  description: 'Все о GTA Online: еженедельные события, ограбления, коллекционные события и многое другое. Полный гид по игре.',
  keywords: ['GTA Online', 'ограбления', 'коллекционные предметы'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online'
  },
  openGraph: {
    title: 'GTA Online — Полный гид по всем разделам',
    description: 'Все разделы GTA Online: еженедельные события, ограбления, коллекционные события и многое другое',
    type: 'website',
    url: 'https://rockstarhub.ru/gta-online',
    siteName: 'Rockstar Хаб',
    images: [
      {
        url: 'https://data.rockstarhub.ru/uploads/large_GTA_Online_Artwork_83260e1623.webp',
        width: 1000,
        height: 562,
        alt: 'GTA Online Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA Online — Полный гид по всем разделам',
    description: 'Все разделы GTA Online: еженедельные события, ограбления, коллекционные события и многое другое',
    images: ['https://data.rockstarhub.ru/uploads/large_GTA_Online_Artwork_83260e1623.webp'],
  },
};

export default function GTAOnlineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}