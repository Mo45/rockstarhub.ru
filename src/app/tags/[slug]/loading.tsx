// /src/app/tags/[slug]/loading.tsx

export default function Loading() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          {/* Заглушки для заголовка и ссылки */}
          <div className="h-8 bg-zinc-800 rounded-md w-1/4 animate-pulse"></div>
          <div className="h-6 bg-zinc-800 rounded-md w-20 animate-pulse"></div>
        </div>
        
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
    </main>
  );
}