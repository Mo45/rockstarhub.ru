'use client';

import { useState, useEffect } from 'react';
import { User, CommentFormProps } from './types';

export default function CommentForm({ contentType, contentId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const validateComment = (text: string): string | null => {
    const trimmedText = text.trim();
    
    // Проверка на пустую строку или только пробелы
    if (trimmedText.length === 0) {
      return 'Комментарий не может быть пустым';
    }
    
    // Проверка на потенциально опасные скрипты
    const scriptPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // теги script
      /javascript:/gi, // javascript: в ссылках
      /onerror\s*=/gi, // обработчики событий
      /onload\s*=/gi,
      /onclick\s*=/gi,
      /onmouseover\s*=/gi
    ];
    
    for (const pattern of scriptPatterns) {
      if (pattern.test(trimmedText)) {
        return 'Комментарий содержит недопустимое содержимое';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Валидация комментария
    const validationError = validateComment(comment);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setError('Вы не авторизованы');
        return;
      }

      // Формируем данные для отправки в правильном формате для Strapi v5
      const commentData: any = {
        data: {
          content: comment.trim() // Сохраняем очищенный от пробелов текст
        }
      };

      // Добавляем связь с автором (пользователем)
      if (user?.id) {
        commentData.data.author = user.id;
      }

      if (contentType === 'articles') {
        commentData.data.article = contentId;
      } else if (contentType === 'achievements') {
        commentData.data.achievement = contentId;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(commentData),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
        return;
      }

      setSuccess('Комментарий успешно добавлен!');
      setComment('');
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      setError('Ошибка при отправке комментария');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 card rounded-lg">
        <p className="text-center">
          Пожалуйста, <a href="/login" className="orange-to-white hover:underline">войдите</a>, чтобы оставить комментарий.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Добавить комментарий</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        
        <div>
          <label htmlFor="comment" className="block mb-2 font-medium">
            Комментарий
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full p-3 border rounded-lg border-zinc-900 focus:outline-none focus:ring-2 focus:ring-rockstar-500"
            disabled={loading}
            placeholder="Напишите ваш комментарий..."
          />
        </div>

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="button-orange"
          >
            {loading ? 'Отправка...' : 'Отправить комментарий'}
          </button>
        </div>
      </form>
    </div>
  );
}