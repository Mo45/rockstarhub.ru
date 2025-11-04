// components/SupportProjectBlock.tsx
import { FaRubleSign, FaYoutube, FaDiscord } from 'react-icons/fa';

const SupportProjectBlock = () => {
  return (
    <div className="card rounded-lg p-6 mt-8 text-white">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">Поддержите развитие Rockstar Хаб</h3>
          <p className="mb-4 opacity-90">
            Ваша поддержка помогает нам создавать больше качественного контента о играх Rockstar. 
            Присоединяйтесь к нашему сообществу, или поддержите нас финансово!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a 
              href="https://pay.cloudtips.ru/p/34ddb3d5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="button-donate flex flex-1 items-center justify-center gap-2"
            >
              <FaRubleSign className="w-4 h-4" />
              Донат
            </a>
            <a 
              href="https://www.youtube.com/@rockstarhubru" 
              target="_blank" 
              rel="noopener noreferrer"
              className="custom-button px-4 py-2 rounded-lg bg-[#c00505] hover:bg-[#b31a1a] flex flex-1 items-center justify-center gap-2"
            >
              <FaYoutube className="w-4 h-4" />
              Подписка на YouTube
            </a>
            <a 
              href="https://discord.gg/ppAAD626vM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="discord-button custom-button bg-[#5865F2] px-4 py-2 rounded-lg hover:bg-[#4752c4] flex flex-1 items-center justify-center gap-2"
            >
              <FaDiscord className="w-4 h-4" />
              Discord-сервер
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportProjectBlock;