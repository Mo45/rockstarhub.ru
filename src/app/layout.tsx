// /src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NextTopLoader from 'nextjs-toploader';
import YandexMetrika from '@/components/YandexMetrika';
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rockstar Хаб - Новости Rockstar Games',
  description: 'Всё о твоих любимых играх от компании Rockstar Games. Новости GTA 6, GTA Online, Red Dead Redemption',
  keywords: ['GTA 6', 'GTA Online', 'RDR 2', 'Rockstar Games'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  openGraph: {
    title: 'Rockstar Хаб - Новости Rockstar Games',
    description: 'Всё о твоих любимых играх от компании Rockstar Games',
    type: 'website',
    url: 'https://rockstarhub.ru/',
    siteName: 'Rockstar Хаб',
    images: [
      {
        url: 'https://data.rockstarhub.ru/uploads/rockstarhhub_logo_17afc57489.jpg',
        width: 1200,
        height: 1200,
        alt: 'RockstarHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rockstar Хаб - Новости Rockstar Games',
    description: 'Всё о твоих любимых играх от компании Rockstar Games',
    images: ['https://data.rockstarhub.ru/uploads/rockstarhhub_logo_17afc57489.jpg'],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Rockstar Хаб',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/hub_192.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/hub_192.png',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <NextTopLoader 
          color="#e19808"
          height={3}
          showSpinner={true}
          shadow="none"
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        {process.env.NEXT_PUBLIC_YANDEX_METRICA_ID && <YandexMetrika />}
        <Analytics/>
      </body>
    </html>
  );
}