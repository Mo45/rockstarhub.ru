// /src/components/PurchaseLink.tsx

import { formatPlatformKey } from '@/lib/platforms';

interface PurchaseLinkProps {
  platformKey: string;
  url: string;
  className?: string;
}

export default function PurchaseLink({ platformKey, url, className = '' }: PurchaseLinkProps) {
  const platformName = formatPlatformKey(platformKey);
  const displayText = `Купить для ${platformName}`;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full button-orange-sm ${className}`}
    >
      {displayText}
    </a>
  );
}