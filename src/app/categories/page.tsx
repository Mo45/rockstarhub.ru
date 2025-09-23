// /src/app/categories/page.tsx

import axios from 'axios';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  articles?: any[];
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/categories?populate=*`
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error);
    return [];
  }
}

export async function generateMetadata() {
  return {
    title: 'Все категории - Rockstar Хаб',
    description: 'Список всех категорий новостей на RockstarHub',
  };
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Все категории
        </h1>
        <p className="text-gray-600">
          {categories.length} категорий на сайте
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/categories/${category.slug}`}
            className="block card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
          >
            <article className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  {category.name}
                </h2>
                {category.articles && (
                  <p className="text-sm text-white opacity-75 mb-4">
                    Статей: {category.articles.length}
                  </p>
                )}
              </div>
              
              <div className="text-xs text-gray-600 mt-4">
                Создана: {new Date(category.createdAt).toLocaleDateString('ru-RU')}
              </div>
            </article>
          </Link>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            На сайте пока нет категорий.
          </p>
        </div>
      )}
    </div>
  );
}