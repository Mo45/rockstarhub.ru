// /src/components/SEOMetaTags.tsx

import { Metadata } from 'next';

interface SEOMetaTagsProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  imageUrl,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags
}: SEOMetaTagsProps): Metadata {
  const fullTitle = `${title} - Rockstar Хаб`;
  const fullUrl = `${process.env.NEXT_PUBLIC_FRONTEND}${url || ''}`;
  const fullImageUrl = imageUrl 
    ? imageUrl.startsWith('http') 
      ? imageUrl 
      : `${process.env.NEXT_PUBLIC_BACKEND}${imageUrl}`
    : undefined;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: fullUrl,
      images: fullImageUrl ? [{ url: fullImageUrl }] : undefined,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags: tags ? tags.join(', ') : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: fullImageUrl ? [fullImageUrl] : undefined,
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

// Компонент для клиентских частей приложения (если нужен)
export default function SEOMetaTags(props: SEOMetaTagsProps) {
  // Этот компонент не рендерит ничего в DOM, т.к. метатеги должны быть в <head>
  return null;
}