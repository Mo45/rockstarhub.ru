// /src/app/privacy/page.tsx

export const metadata = {
  title: 'Политика конфиденциальности - Rockstar Хаб',
  description: 'Политика конфиденциальности RockstarHub - как мы собираем, используем и защищаем ваши данные',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-6">Политика конфиденциальности</h1>
          
          <div className="prose prose-lg max-w-none text-white">
            <p className="mb-6">Последнее обновление: 20.09.2025</p>

            <h2 className="text-2xl font-bold mb-4 mt-8">1. Введение</h2>
            <p className="mb-6">
              В Rockstar Хаб мы серьезно относимся к вашей конфиденциальности. Эта политика конфиденциальности 
              описывает, как мы собираем, используем и защищаем вашу личную информацию при использовании нашего сайта.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">2. Собираемая информация</h2>
            <p className="mb-4">Мы можем собирать следующую информацию:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Данные об использовании сайта</li>
              <li>Данные cookies и аналогичные технологии</li>
              <li>Данные об использовании сайта</li>
              <li>Данные необходимые для регистрации: e-mail, логин и пароль</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">3. Использование информации</h2>
            <p className="mb-4">Мы используем собранную информацию для:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Предоставления и улучшения наших услуг</li>
              <li>Авторизации на сайте и использования функционала комментирования</li>
              <li>Анализа использования сайта для улучшения пользовательского опыта</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">4. Защита информации</h2>
            <p className="mb-6">
              Мы реализуем соответствующие меры безопасности для защиты вашей личной информации 
              от несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>E-mail используется исключительно для регистрации</li>
              <li>E-mail не используется для рассылок или передачи третьим лицам</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">5. Cookies</h2>
            <p className="mb-6">
              Наш сайт использует cookies для улучшения пользовательского опыта. Вы можете настроить 
              свой браузер для отказа от cookies, но это может повлиять на функциональность сайта.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">6. Сторонние ссылки</h2>
            <p className="mb-6">
              Наш сайт может содержать ссылки на сторонние веб-сайты. Мы не несем ответственности 
              за контент или политику конфиденциальности этих сайтов.
            </p>


            <h2 className="text-2xl font-bold mb-4 mt-8">7. Изменения в политике</h2>
            <p className="mb-6">
              Мы можем периодически обновлять эту политику конфиденциальности. Любые изменения 
              будут опубликованы на этой странице с указанием даты последнего обновления.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">8. Контакты</h2>
            <p className="mb-6">
              Если у вас есть вопросы о нашей политике конфиденциальности, пожалуйста, 
              свяжитесь с нами через <a href="/contact" className="orange-to-white">форму обратной связи</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}