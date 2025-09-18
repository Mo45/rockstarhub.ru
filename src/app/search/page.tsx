import { Suspense } from 'react';
import SearchResults from './SearchResults';

export const metadata = {
  title: 'Поиск - RockstarHub',
  description: 'Результаты поиска по сайту RockstarHub',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Поиск</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </main>
  );
}