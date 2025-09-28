// /src/app/gta-online-weekly/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GTA Online: События и бонусы этой недели',
  description: 'Игровые события GTA Online текущей недели: Скидки на транспорт, оружие и недвижимость. Все доступные бонусы к RP и GTA$',
  openGraph: {
    title: 'GTA Online: События и бонусы этой недели',
    description: 'Игровые события GTA Online текущей недели: Скидки на транспорт, оружие и недвижимость. Все доступные бонусы к RP и GTA$',
    type: 'website',
  },
};

export default function GTAOnlineWeeklyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}