// /src/app/rules/page.tsx

import Link from 'next/link';

export const metadata = {
  title: 'Правила сайта - Rockstar Хаб',
  description: 'Правила общения на сайте Rockstar Хаб и условия использования',
};

export default function RulesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Хлебные крошки */}
        <nav className="flex mb-4" aria-label="Хлебные крошки">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 transition-colors">
                Главная
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-rockstar-500 font-medium">Правила сайта</span>
            </li>
          </ol>
        </nav>
        
        <div className="card rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-6">Правила общения на сайте Rockstar Хаб</h1>
          <h2 className="text-2xl text-orange-400 mb-6">Или как не получить бан</h2>

          <div className="prose prose-lg max-w-none text-white">
            <p className="mb-6">
              Rockstar Хаб (rockstarhub.ru, далее — Сайт) — информационный портал, публикующий материалы 
              о играх Rockstar Games: GTA V, GTA Online, Red Dead Redemption 2 и т.д.
            </p>

            <p className="mb-6">
              Пользователи могут публиковать комментарии (текстовые/графические) к статьям после регистрации и авторизации.
              Публикуя комментарий, вы безоговорочно принимаете настоящие Правила:
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Правила пользования сайтом Rockstar Хаб</h2>
            
            <h3 className="text-xl font-bold mb-3 mt-6">Спам и реклама</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Размещение релевантных ссылок в контексте обсуждения разрешено</li>
              <li>Запрещены комментарии, единственной целью которых является реклама сайтов/сервисов</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 mt-6">Запрещённый контент</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Порнографические материалы</li>
              <li>Сцены жестокости и насилия</li>
              <li>Контент, нарушающий законодательство РФ (экстремизм, разжигание розни и т.д.)</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 mt-6">Оскорбительные ники и контент</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Запрещены аккаунты с оскорбительными/унизительными никнеймами</li>
              <li>Не допускаются личные оскорбления, угрозы, дискриминация по любым признакам</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 mt-6">Деструктивное поведение</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Провокации на религиозной, политической, национальной почве</li>
              <li>Намеренно грубый троллинг и распространение ложной информации</li>
              <li>Массовый флуд и оффтоп</li>
              <li>Создание фейковых аккаунтов и любые попытки обойти блокировку</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 mt-6">Последствия нарушений</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Нарушающие правила комментарии удаляются без предупреждения</li>
              <li>При систематических нарушениях — блокировка аккаунта</li>
              <li>В случае грубых нарушений — удаление всех комментариев пользователя</li>
            </ul>

            <div className="mt-8 p-6 bg-zinc-900 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Важно</h3>
              <p className="mb-4">
                Администрация оставляет за собой право:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Толковать и применять правила по своему усмотрению</li>
                <li>Вносить изменения в настоящие Правила</li>
                <li>Блокировать пользователей без объяснения причин</li>
              </ul>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              <p>Последняя редакция от 20 сентября 2025 года</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}