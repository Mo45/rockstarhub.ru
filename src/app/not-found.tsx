import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-rockstar-500 mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Страница не найдена</h2>
          <p className="mb-8 text-lg opacity-80">
            Извините, мы не можем найти страницу, которую вы ищете
          </p>
          <Link 
            href="/"
            className="button-black"
          >
            Вернуться на главную
          </Link>
        </div>
      </main>
    </div>
  );
}