// /src/app/contact/page.tsx

import EmailProtection from './EmailProtection';

export const metadata = {
  title: 'Контакты - Rockstar Хаб',
  description: 'Свяжитесь с командой RockstarHub - мы всегда рады вашим вопросам и предложениям',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-6">Контакты</h1>
          
          <div className="grid md:grid-cols-1 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Свяжитесь с нами</h2>
              <p className="mb-6">
                У вас есть вопросы, предложения или вы хотите сотрудничать с нами? 
                Напишите нам на электронную почту, и мы ответим вам в ближайшее время.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Электронная почта</h3>
                  <EmailProtection />
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Социальные сети</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      VK
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Discord
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Telegram
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Время ответа</h3>
                  <p>Мы стараемся отвечать на все сообщения в течение 24 часов.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}