// /src/app/guides/page.tsx

import Link from 'next/link';
import GuidesList from '@/components/GuidesList';

export const metadata = {
  title: 'Все руководства - Rockstar Хаб',
  description: 'Подробные руководства и гайды GTA Online, GTA 5, Red Dead Redemption 2 и Red Dead Online',
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Все руководства</h1>
        <GuidesList limit={24}/>

        <div className="card rounded-lg p-6 md:p-8 mb-2 mt-8">
          <div className="prose max-w-none text-sm">
            <p className="mb-4">
              Полезные руководства и гайды для твоих любимых серий <strong>Grand Theft Auto</strong>, <strong>Red Dead Redemption</strong> и других играх компании Rockstar Games.
            </p>
            <p className="mb-4">
              Как выполнить ежедневные задания или эффектривно заработать деньги (GTA$) в <strong>GTA Online</strong>, или например, получить редкие достижения в <strong>Red Dead Redemption 2</strong>.
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