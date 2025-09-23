// /src/app/page.tsx

import Link from 'next/link';
import ArticleList from '@/components/ArticleList';
import { generateSEOMetadata } from '@/components/SEOMetaTags';

export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Новости Rockstar Games',
    description: 'Всё о твоих любимых играх от компании Rockstar Games. Новости GTA 6, GTA Online, Red Dead Redemption',
    url: '/',
    type: 'website',
    tags: ['Rockstar Games', 'GTA', 'GTA6', 'Red Dead Redemption'],
  });
}

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Последние статьи</h1>
          <Link 
            href="/articles" 
            className="white-to-orange font-medium text-sm"
          >
            Все статьи →
          </Link>
        </div>
        <ArticleList limit={12} />
      </div>
    </main>
  );
}