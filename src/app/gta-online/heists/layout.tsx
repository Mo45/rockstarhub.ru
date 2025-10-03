// /src/app/gta-online/heists/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GTA Online — Все ограбления (Heists)',
  description: 'Полный список всех ограблений в GTA Online: награды, количество игроков, требования и особенности прохождения',
  keywords: ['GTA Online', 'ограбления', 'heists', 'награды'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online/heists'
  },
  openGraph: {
    title: 'GTA Online — Все ограбления',
    description: 'Полный список всех ограблений в GTA Online: награды, количество игроков, требования и особенности прохождения',
    type: 'website',
    url: 'https://rockstarhub.ru/gta-online/heists',
    siteName: 'Rockstar Хаб',
  },
};

export default function GTAOnlineHeistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}