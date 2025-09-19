'use client';

import { useState, useEffect } from 'react';
import { Comment, CommentsListProps } from './types';
import Image from 'next/image'

interface ApiComment {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author: {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    avatar?: {
      id: number;
      documentId: string;
      name: string;
      alternativeText: null | string;
      caption: null | string;
      width: number;
      height: number;
      formats: null | any;
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: null | string;
      provider: string;
      provider_metadata: null | any;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  };
}

export default function CommentsList({ contentType, contentId }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCommentId, setCopiedCommentId] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [contentType, contentId]);

  const fetchComments = async () => {
    try {
      // Формируем фильтр в зависимости от типа контента
      let filterType = '';
      if (contentType === 'articles') {
        filterType = 'article';
      } else if (contentType === 'achievements') {
        filterType = 'achievement';
      }

      if (!filterType) {
        setComments([]);
        setLoading(false);
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/api/comments?filters[${filterType}][id][$eq]=${contentId}&populate[0]=author&populate[1]=author.avatar&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=100`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
        return;
      }

      // Преобразуем данные из формата API в ожидаемый формат компонента
      const formattedComments = data.data.map((apiComment: ApiComment) => ({
        id: apiComment.id,
        documentId: apiComment.documentId,
        attributes: {
          content: apiComment.content,
          createdAt: apiComment.createdAt,
          author: {
            data: {
              id: apiComment.author.id,
              attributes: {
                username: apiComment.author.username,
                avatar: apiComment.author.avatar
              }
            }
          }
        }
      }));

      setComments(formattedComments);
    } catch (error) {
      setError('Ошибка при загрузке комментариев');
    } finally {
      setLoading(false);
    }
  };

  const copyCommentLink = (documentId: string) => {
    const commentUrl = `${window.location.origin}${window.location.pathname}#comment-${documentId}`;
    navigator.clipboard.writeText(commentUrl)
      .then(() => {
        setCopiedCommentId(documentId);
        setTimeout(() => setCopiedCommentId(null), 2000);
      })
      .catch(err => {
        console.error('Ошибка при копировании ссылки: ', err);
      });
  };

  if (loading) return <div className="p-4">Загрузка комментариев...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Комментарии ({comments.length})</h3>
      
      {comments.length === 0 ? (
        <p className="text-gray-500">Пока нет комментариев.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              id={`comment-${comment.documentId}`}
              className="card p-4 rounded-lg shadow relative"
            >
              <div className="flex items-start space-x-3">
                {comment.attributes.author.data.attributes.avatar ? (
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_BACKEND}${comment.attributes.author.data.attributes.avatar.url}`}
                    decoding="async"
                    loading="lazy"
                    alt={comment.attributes.author.data.attributes.username}
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center">
                    {comment.attributes.author.data.attributes.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                      {comment.attributes.author.data.attributes.username}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-zinc-700">
                        {new Date(comment.attributes.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                      <button
                        onClick={() => copyCommentLink(comment.documentId)}
                        className="text-zinc-500 hover:text-zinc-700 transition-colors"
                        title="Скопировать ссылку на комментарий"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.attributes.content}</p>
                  
                  {copiedCommentId === comment.documentId && (
                    <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Ссылка скопирована!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}