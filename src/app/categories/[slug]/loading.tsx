// /src/app/categories/[slug]/loading.tsx

export default function Loading() {
  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        {/* Заглушки для заголовка и описания */}
        <div className="h-12 bg-zinc-800 rounded-md mb-4 animate-pulse"></div>
        <div className="h-6 bg-zinc-800 rounded-md w-1/3 animate-pulse"></div>
      </header>
      
      {/* Сетка карточек в состоянии загрузки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card article-list-card animate-pulse">
            <div className="w-full h-48 bg-zinc-800"></div>
            <div className="p-4 h-full flex flex-col">
              <div className="h-6 bg-zinc-800 rounded-md mb-2"></div>
              <div className="h-4 bg-zinc-800 rounded-md mb-2"></div>
              <div className="h-4 bg-zinc-800 rounded-md mb-4 w-2/3"></div>
              <div className="article-meta flex justify-between items-center">
                <div className="h-3 bg-zinc-800 rounded-md w-1/3"></div>
                <div className="h-3 bg-zinc-800 rounded-md w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}