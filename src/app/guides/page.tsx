// /src/app/guides/page.tsx

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
      </div>
    </main>
  );
}