import ArticleList from '@/components/ArticleList';

export const metadata = {
  title: 'Все статьи - Rockstar Хаб',
  description: 'Все новости и статьи о играх от Rockstar Games',
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Все статьи</h1>
        <ArticleList />
      </div>
    </main>
  );
}