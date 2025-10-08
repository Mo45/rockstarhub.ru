// /src/app/gta-online/shark-cards/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Купить Shark Cards для GTA Online — Официальные ваучеры пополнения GTA$',
  description: 'Купить Shark Cards для GTA Online по лучшим ценам. Официальные ваучеры с мгновенной доставкой. Легальный способ получения GTA$ без риска бана.',
  keywords: ['купить shark cards', 'shark cards gta online', 'GTA$ ваучеры', 'деньги GTA Online'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  alternates: {
    canonical: '/gta-online/shark-cards'
  },
  openGraph: {
    title: 'Купить Shark Cards для GTA Online — Официальные ваучеры пополнения GTA$',
    description: 'Купить Shark Cards для GTA Online по лучшим ценам. Официальные ваучеры с мгновенной доставкой',
    type: 'website',
    url: 'https://rockstarhub.ru/gta-online/shark-cards',
    siteName: 'Rockstar Хаб',
    images: [
      {
        url: 'https://data.rockstarhub.ru/uploads/shark_cards_963abe7968.jpg',
        width: 1200,
        height: 1200,
        alt: 'Shark Cards GTA Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Купить Shark Cards для GTA Online — Официальные ваучеры пополнения GTA$',
    description: 'Купить Shark Cards для GTA Online по лучшим ценам. Официальные ваучеры с мгновенной доставкой',
    images: ['https://data.rockstarhub.ru/uploads/shark_cards_963abe7968.jpg'],
  },
};

export default function SharkCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}