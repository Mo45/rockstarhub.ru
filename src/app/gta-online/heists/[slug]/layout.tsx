// /src/app/gta-online/heists/[slug]/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ограбления GTA Online - Детальное описание',
  description: 'Полное руководство по ограблениям в GTA Online: награды, требования, элитные испытания и советы по прохождению',
  keywords: ['GTA Online', 'ограбления', 'heists', 'награды', 'элитные испытания'],
  creator: 'Kirill Krasin',
  publisher: 'Rockstar Хаб',
  metadataBase: new URL('https://rockstarhub.ru'),
  openGraph: {
    title: 'Ограбления GTA Online - Детальное описание',
    description: 'Полное руководство по ограблениям в GTA Online: награды, требования, элитные испытания и советы по прохождению',
    type: 'website',
    siteName: 'Rockstar Хаб',
  },
};

export default function SingleHeistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}