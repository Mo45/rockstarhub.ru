'use client';

import {
  VKShareButton,
  TelegramShareButton,
  TwitterShareButton,
  VKIcon,
  TelegramIcon,
  TwitterIcon,
} from 'react-share';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  return (
    <div className="flex items-center gap-2 share-icons">
      <span className="text-xs opacity-60 invisible md:visible">Поделиться:</span>
      <VKShareButton url={url} title={title}>
        <VKIcon size={32} round />
      </VKShareButton>
      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>
  );
}