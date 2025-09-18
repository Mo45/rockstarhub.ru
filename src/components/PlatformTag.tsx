// src/components/PlatformTag.tsx
import { getPlatformClass, getPlatformLabel, getPlatformTitle, getPlatformIcon } from '@/lib/platforms';

interface PlatformTagProps {
  platform: string;
  className?: string;
  tagClassName?: string;
}

export default function PlatformTag({ platform, className = '', tagClassName }: PlatformTagProps) {
  const platformClass = getPlatformClass(platform);
  const platformLabel = getPlatformLabel(platform);
  const platformTitle = getPlatformTitle(platform);
  const PlatformIcon = getPlatformIcon(platform);
  
  // Используем переданный tagClassName или стандартный 'platform-tag'
  const baseClassName = tagClassName || 'platform-tag';
  
  return (
    <span 
      className={`${baseClassName} ${platformClass} ${className}`}
      title={platformTitle}
    >
      {PlatformIcon && <PlatformIcon className="w-4 h-4" />}
      {platformLabel}
    </span>
  );
}