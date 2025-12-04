// /src/app/gta-online/weekly/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GTA Online — Новая неделя в ГТА Онлайн, новая бонусная неделя, скидки на этой неделе',
  description: 'Новая неделя в GTA Online: Скидки на транспорт, оружие и недвижимость. Все доступные бонусы 2X к RP и GTA$',
  keywords: ['GTA Online', 'новая бонусная неделя', 'gta online скидки на этой неделе', 'гта онлайн неделя'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online/weekly'
  },
  openGraph: {
    title: 'GTA Online — Новая неделя в ГТА Онлайн, новая бонусная неделя, скидки на этой неделе',
    description: 'Игровые события GTA Online текущей недели: Скидки на транспорт, оружие и недвижимость. Все доступные бонусы 2X к RP и GTA$',
    type: 'website',
    url: 'https://rockstarhub.ru/gta-online/weekly',
    siteName: 'Rockstar Хаб',
  },
};

export default function GTAOnlineWeeklyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}