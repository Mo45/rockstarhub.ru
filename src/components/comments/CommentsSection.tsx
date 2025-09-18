'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentsList from './CommentsList';
import { CommentsSectionProps } from './types';

export default function CommentsSection({ contentType, contentSlug }: CommentsSectionProps) {
  const [contentId, setContentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchContentId = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/${contentType}?filters[slug][$eq]=${contentSlug}`
        );
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          setContentId(data.data[0].id);
        } else {
          setError('Контент не найден');
        }
      } catch (error) {
        setError('Ошибка при загрузке контента');
      } finally {
        setLoading(false);
      }
    };

    fetchContentId();
  }, [contentType, contentSlug]);

  const handleCommentAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!contentId) return <div className="p-4">Не удалось загрузить контент</div>;

  return (
    <div className="mt-8">
      <CommentForm 
        contentType={contentType} 
        contentId={contentId} 
        onCommentAdded={handleCommentAdded} 
      />
      
      <CommentsList 
        key={refreshKey}
        contentType={contentType} 
        contentId={contentId} 
      />
    </div>
  );
}