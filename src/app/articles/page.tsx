// /src/app/articles/page.tsx

"use client";

import { useState } from 'react';
import ArticleListWithPagination from '@/components/ArticleListWithPagination';

export default function ArticlesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Все статьи</h1>
        <ArticleListWithPagination 
          page={currentPage}
          pageSize={12}
          showPagination={true}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}

export const metadata = {
  title: 'Все статьи - Rockstar Хаб',
  description: 'Все новости и статьи о играх от Rockstar Games',
};