'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'

interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  platforms?: string[];
  gamertag?: string;
  vanityUrl?: string;
  psnId?: string;
  avatar?: {
    id: number;
    url: string;
    formats: {
      thumbnail: {
        url: string;
      };
    };
  };
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    platforms: [] as string[],
    gamertag: '',
    vanityUrl: '',
    psnId: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        platforms: user.platforms || [],
        gamertag: user.gamertag || '',
        vanityUrl: user.vanityUrl || '',
        psnId: user.psnId || ''
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    const jwt = localStorage.getItem('jwt');
    
    if (!jwt) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/me?populate=*`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await res.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setFormError('Ошибка при загрузке данных пользователя');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера файла (макс. 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Размер файла не должен превышать 5 МБ');
      return;
    }

    // Проверка пропорций изображения
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (img.width !== img.height) {
        setAvatarError('Изображение должно быть квадратным (1:1)');
        URL.revokeObjectURL(img.src);
        return;
      }

      if (img.width < 128 || img.height < 128 || img.width > 1024 || img.height > 1024) {
        setAvatarError('Размер изображения должен быть между 128x128 и 1024x1024 пикселей');
        URL.revokeObjectURL(img.src);
        return;
      }

      URL.revokeObjectURL(img.src);

      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        router.push('/login');
        return;
      }

      setUploading(true);
      setAvatarError('');
      setSuccess('');

      try {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('ref', 'plugin::users-permissions.user');
        formData.append('refId', user?.id.toString() || '');
        formData.append('field', 'avatar');

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload avatar');
        }

        setSuccess('Аватар успешно обновлен');
        fetchUserData();
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setAvatarError('Ошибка при загрузке аватара');
      } finally {
        setUploading(false);
      }
    };

    img.onerror = () => {
      setAvatarError('Ошибка загрузки изображения');
      URL.revokeObjectURL(img.src);
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const platform = value;
      setFormData(prev => ({
        ...prev,
        platforms: checked
          ? [...prev.platforms, platform]
          : prev.platforms.filter(p => p !== platform)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateField = (value: string, fieldName: string): boolean => {
    if (fieldName === 'gamertag') {
      // Для Gamertag разрешаем пробелы, но проверяем что строка не пустая
      return value.trim().length > 0;
    } else {
      // Для Vanity URL и PSN ID запрещаем пробелы
      return value.trim().length > 0 && !/\s/.test(value.trim());
    }
  };

  const handleSave = async () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt || !user) return;

    // Валидация полей
    const validationErrors: string[] = [];

    if (formData.platforms.includes('Xbox') && !validateField(formData.gamertag, 'gamertag')) {
      validationErrors.push('Gamertag не может быть пустым');
    }

    if (formData.platforms.includes('Steam') && !validateField(formData.vanityUrl, 'vanityUrl')) {
      validationErrors.push('Vanity URL не может быть пустым или содержать пробелы');
    }

    if (formData.platforms.includes('PlayStation') && !validateField(formData.psnId, 'psnId')) {
      validationErrors.push('PSN ID не может быть пустым или содержать пробелы');
    }

    if (validationErrors.length > 0) {
      setFormError(validationErrors.join(', '));
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update user');
      
      setSuccess('Данные успешно обновлены');
      setFormError('');
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      setFormError('Ошибка при обновлении данных');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rockstar-500 mx-auto"></div>
          <p className="mt-4">Загрузка данных...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
          <p>Не удалось загрузить данные пользователя.</p>
          <Link href="/login" className="text-rockstar-500 hover:underline mt-4 inline-block">
            Войти снова
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Мой аккаунт</h1>
        
        <div className="card rounded-lg shadow-md p-6">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
              {user.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND}${user.avatar.formats?.thumbnail?.url || user.avatar.url}`}
                  alt="Аватар"
                  decoding="async"
                  loading="lazy"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rockstar-100 text-rockstar-800 text-4xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {avatarError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {avatarError}
              </div>
            )}
            
            <label className="button-orange cursor-pointer">
              {uploading ? 'Загрузка...' : 'Сменить аватар'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">Квадратное изображение, до 5 МБ.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Основная информация</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
                <p className="text-lg">{user.username}</p>
              </div>

            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Статистика</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата регистрации</label>
                <p className="text-lg">{formatDate(user.createdAt)}</p>
              </div>
              
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Игровые профили</h2>
            
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Платформы</label>
              <div className="space-y-2">
                {['Xbox', 'PlayStation', 'Steam'].map(platform => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      value={platform}
                      checked={formData.platforms.includes(platform)}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mr-2"
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>

            {formData.platforms.includes('Xbox') && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Gamertag (Xbox)</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gamertag"
                    value={formData.gamertag}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-zinc-900 rounded focus:outline-none focus:ring-2 focus:ring-rockstar-500"
                    placeholder="Введите Gamertag"
                  />
                ) : (
                  <p className="text-lg">{user.gamertag || 'Не указан'}</p>
                )}
              </div>
            )}

            {formData.platforms.includes('Steam') && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Steam Vanity URL (steamcommunity.com/id/XXX)</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="vanityUrl"
                    value={formData.vanityUrl}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-zinc-900 rounded focus:outline-none focus:ring-2 focus:ring-rockstar-500"
                    placeholder="Введите Vanity URL"
                  />
                ) : (
                  <p className="text-lg">{user.vanityUrl || 'Не указан'}</p>
                )}
              </div>
            )}

            {formData.platforms.includes('PlayStation') && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">PSN ID (PlayStation)</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="psnId"
                    value={formData.psnId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-zinc-900 rounded focus:outline-none focus:ring-2 focus:ring-rockstar-500"
                    placeholder="Введите PSN ID"
                  />
                ) : (
                  <p className="text-lg">{user.psnId || 'Не указан'}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-900 flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormError('');
                  }}
                  className="button-red w-full md:w-auto"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="button-green w-full md:w-auto"
                >
                  Сохранить
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="button-orange w-full md:w-auto"
              >
                Редактировать профиль
              </button>
            )}
            <Link
              href="/logout"
              className="button-red w-full md:w-auto text-center"
            >
              Выйти из аккаунта
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}