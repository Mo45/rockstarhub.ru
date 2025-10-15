// /src/app/gta-online/ufo-sightseeing/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'НЛО в GTA Online: все локации пришельцев и руководство по Sightseeing',
  description: 'Полное руководство по поиску НЛО в GTA Online. Все 26 локаций пришельцев, этапы события Sightseeing, награды и советы по фотографированию.',
  keywords: ['GTA Online', 'НЛО', 'UFO', 'Sightseeing', 'пришельцы', 'Омега', 'GTA$'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online/ufo-sightseeing'
  },
  openGraph: {
    title: 'НЛО в GTA Online: все локации пришельцев и руководство по Sightseeing',
    description: 'Полное руководство по поиску НЛО в GTA Online. Все 26 локаций пришельцев, этапы события Sightseeing, награды и советы по фотографированию.',
    type: 'website',
    url: 'https://rockstarhub.ru/gta-online/ufo-sightseeing',
    siteName: 'Rockstar Хаб',
  },
};

export default function UfoSightseeingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}