import Link from 'next/link';

export const metadata = {
  title: 'Поддержать проект - Rockstar Хаб',
  description: 'Поддержите Rockstar Хаб и помогите нам развиваться дальше',
};

export default function DonatePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-6">Поддержать проект</h1>

          <div className="prose prose-lg max-w-none text-white">
            <p className="mb-6">
              Rockstar Хаб создаётся и развивается силами энтузиастов. Ваша поддержка помогает нам оставаться независимыми, 
              продолжать работу над сайтом и создавать новый контент для сообщества.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Способы поддержки</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-zinc-900 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Boosty</h3>
                <p className="mb-4">
                  Подписка на Boosty — это возможность поддержать нас на регулярной основе с помощью ежемесячных платежей.
                </p>
                <a 
                  href="https://boosty.to/krasinkirill/donate" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="button-orange inline-block"
                >
                  Поддержать на Boosty
                </a>
              </div>

              <div className="p-6 bg-zinc-900 rounded-lg">
                <h3 className="text-xl font-bold mb-4">CloudTips</h3>
                <p className="mb-4">
                  Разовые пожертвования через CloudTips — быстрый и удобный способ поддержать проект.
                </p>
                <a 
                  href="https://pay.cloudtips.ru/p/34ddb3d5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="button-orange inline-block"
                >
                  Поддержать через CloudTips
                </a>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">QR-код для доната через CloudTips</h2>
            <div className="bg-zinc-900 p-6 rounded-lg flex flex-col items-center">
              <div className="w-64 h-64 bg-gray-700 flex items-center justify-center mb-4">
                <img src="/cloudtips_qrCode.png" alt="CloudTips QR Code" />
              </div>
              <p className="text-center">
                Отсканируйте QR-код для быстрого перехода к оплате через CloudTips
              </p>
            </div>

            <div className="mt-8 p-6 bg-zinc-900 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Ваша поддержка важна</h3>
              <p className="mb-4">
                Благодаря вашей помощи мы сможем развивать сайт, добавлять новый функционал и продолжать радовать 
                сообщество актуальными новостями и качественными материалами о играх Rockstar.
              </p>
              <p>
                Спасибо, что остаётесь с нами!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}