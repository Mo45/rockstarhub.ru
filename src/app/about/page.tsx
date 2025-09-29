// /src/app/about/page.tsx

import Link from 'next/link';

export const metadata = {
  title: 'О сайте - Rockstar Хаб',
  description: 'Ваш источник новостей и информации о GTA V, GTA Online, Red Dead Redemption 2 и грядущей GTA 6',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-6">О сайте</h1>

          <div className="prose prose-lg max-w-none text-white">
            <p className="mb-6">
              Добро пожаловать в Rockstar Хаб — ваш главный источник информации о играх Rockstar Games: <Link href="/games/gta-v" className="orange-to-white">GTA 5</Link>, <Link href="/games/gtao" className="orange-to-white">GTA Online</Link>, <Link href="/games/rdr2" className="orange-to-white">Red Dead Redemption 2</Link> и грядущей <Link href="/games/gtavi" className="orange-to-white">GTA 6</Link>. Мы предоставляем самые свежие новости, эксклюзивные материалы и детальные руководства по самым популярным проектам легендарной студии.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Зачем?</h2>
            <p className="mb-6">
              Чтобы создать лучшее сообщество поклонников культовых игр Rockstar, где каждый 
              может найти актуальную информацию, поделиться своим опытом и быть в курсе всех событий, связанных с этими играми.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Что мы предлагаем</h2>
            <ul className="list-disc pl-6 mb-6 space-y-3">
              <li>Эксклюзивные <Link href="/articles" className="orange-to-white">новости и анонсы</Link></li>
              <li>Первые подробности о готовящейся <Link href="/games/gtavi" className="orange-to-white">GTA 6</Link></li>
              <li>Глубокие <Link href="/tags/analytics" className="orange-to-white">аналитические статьи</Link> и обзоры обновлений</li>
              <li>Подробные гайды и советы по прохождению</li>
              <li>Профессиональные переводы статей и интервью</li>
              <li><Link href="/games" className="orange-to-white">База данных игр</Link> и достижений</li>
              <li><a 
                  href="https://discord.gg/EkfMa3MU" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="orange-to-white"
                >Сообщество</a> единомышленников-фанатов</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">Кто мы</h2>
            <p className="mb-6">
              Rockstar Хаб создан и поддерживается одним энтузиастом и давним поклонником творчества Rockstar Games. Всё для того, чтобы делиться 
              своей страстью к вселенной GTA и Red Dead с другими фанатами и игроками.
            </p>

            <div className="mt-8 p-6 bg-zinc-900 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Присоединяйтесь к нашему сообществу</h3>
              <p className="mb-4">
                Следите за Rockstar Хаб в социальных сетях, чтобы быть в курсе всех обновлений GTA Online, 
                новостей о Red Dead Redemption 2 и первым узнавать новые подробности о готовящейся GTA 6.
              </p>
              <div className="flex gap-4">
                <Link href="/register" className="button-orange">Регистрация</Link>
                <a 
                  href="https://discord.gg/EkfMa3MU" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button-orange"
                >
                  Discord-сервер
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}