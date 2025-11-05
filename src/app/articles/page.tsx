// /src/app/articles/page.tsx

import Link from 'next/link';
import ArticleList from '@/components/ArticleList';

export const metadata = {
  title: 'Все статьи - Rockstar Хаб',
  description: 'Все новости и статьи о играх от Rockstar Games',
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Все статьи</h1>
        <ArticleList limit={24}/>

        <div className="card rounded-lg p-6 md:p-8 mb-2 mt-8">
          <div className="prose max-w-none text-sm">
            <p className="mb-4">
              Самые последние официальные новости, слухи и утечки о твоих любимых сериях <strong>Grand Theft Auto</strong>, <strong>Red Dead Redemption</strong> и других играх компании Rockstar Games.
            </p>
            <p className="mb-4">
              Например, мы можем рассказать тебе о грядущей <strong><Link href="/categories/gtavi" title="GTA 6" className="white-to-orange">Grand Theft Auto 6</Link></strong>, или нестареющей <strong><Link href="/categories/gta-online" title="GTA Online" className="white-to-orange">GTA Online</Link></strong>.
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