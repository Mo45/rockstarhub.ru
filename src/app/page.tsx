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
    tags: ['Rockstar Games', 'GTA Online', 'GTA 6', 'RDR 2'],
  });
}

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Новости Rockstar Games</h1>
          <Link 
            href="/articles" 
            className="white-to-orange font-medium text-sm"
          >
            Все статьи →
          </Link>
        </div>
        <ArticleList limit={12} />

        <div className="card rounded-lg p-6 md:p-8 mb-4 mt-4">
          <div className="prose max-w-none text-sm">
            <p className="mb-4">
              Являетесь поклонником культовых серий GTA, Red Dead или других проектов Rockstar Games? 
              Тогда вы нашли именно то, что искали! Наш портал — это ваш пропуск в захватывающий мир 
              одной из самых талантливых студий в игровой индустрии.
            </p>
            <p className="mb-4">
              Мы собрали для вас все доступные данные о грядущей — <strong><Link href="/games/gtavi" className="white-to-orange">Grand Theft Auto 6</Link></strong>.
              Узнайте первыми о дате выхода, смотрите эксклюзивные геймплейные 
              видео, изучайте увлекательную аналитику и будьте в курсе всех деталей на RockstarHub.ru.
            </p>
            <p className="mb-4">
              Не забываем мы и о легендарной <strong><Link href="/games/gtao" className="white-to-orange">GTA Online</Link></strong> — одном из самых успешных проектов студии. 
              Если вы активный игрок или просто следите за развитием многопользовательской вселенной GTA 5, 
              в вашем распоряжении специальный Хаб с множеством полезных материалов.
            </p>
            <p className="mb-4">
              <strong>RockstarHub.ru</strong> — это не просто информационный портал, а настоящее сообщество 
              единомышленников. Даже если вы только начинаете знакомство с творчеством Rockstar Games, 
              наши материалы помогут вам стать настоящим экспертом и возможно — обрести новую страсть.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}