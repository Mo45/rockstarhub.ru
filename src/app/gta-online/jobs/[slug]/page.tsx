// /src/app/gta-online/jobs/[slug]/page.tsx

import { notFound } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import AwardSection from '@/components/AwardSection';
import ShareButtons from '@/components/ShareButtons';
import { FaDiscord } from "react-icons/fa";
import './styles.css';

interface ImageData {
  id: number;
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

interface Award {
  id: number;
  description: string;
  bronze?: number;
  silver?: number;
  gold?: number;
  platinum?: number;
  title_en: string;
  title_ru: string;
}

interface JobData {
  id: number;
  title_en: string;
  title_ru: string;
  slug: string;
  players: string;
  release_date: string;
  content: any[];
  cover_image: ImageData;
  awards: Award[];
  youtube?: string;
  series_title_ru: string;
  series_title_en: string;
  map_icon: string;
  dlc_name_en: string;
  dlc_name_ru: string;
  requirments: string;
}

interface ApiResponse {
  data: JobData[];
}

const transformAward = (award: any): Award => ({
  ...award,
  bronze: award.bronze ?? undefined,
  silver: award.silver ?? undefined,
  gold: award.gold ?? undefined,
  platinum: award.platinum ?? undefined,
});

async function getJob(slug: string): Promise<JobData | null> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND}/api/jobs`);
    url.searchParams.set('filters[slug][$eq]', slug);
    url.searchParams.set('populate[0]', 'cover_image');
    url.searchParams.set('populate[1]', 'awards.image');
    
    const response = await axios.get<ApiResponse>(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
        timeout: 25000
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      const rawData = response.data.data[0];
      const transformedData = {
        ...rawData,
        awards: rawData.awards?.map(transformAward) || []
      };
      return transformedData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const jobData = await getJob(slug);
  
  if (!jobData) {
    return {
      title: 'Дело не найдено - Rockstar Хаб',
      description: 'Запрашиваемое дело не найдено в базе данных GTA Online.',
    };
  }
  
  const title = `${jobData.title_ru} - ${jobData.title_en} | Дела GTA Online - Jobs`;
  const description = `Подробное руководство по делу «${jobData.title_ru}» в GTA Online. Количество игроков: ${jobData.players}`;
  const imageUrl = jobData.cover_image ? `${process.env.NEXT_PUBLIC_BACKEND}${jobData.cover_image.url}` : null;
  
  return {
    title,
    description,
    keywords: ['GTA Online', jobData.title_ru, jobData.title_en, 'награды'],
    creator: 'Kirill Krasin',
    publisher: 'Rockstar Хаб',
    metadataBase: new URL('https://rockstarhub.ru'),
    alternates: {
      canonical: `/gta-online/jobs/${jobData.slug}`
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://rockstarhub.ru/gta-online/jobs/${jobData.slug}`,
      siteName: 'Rockstar Хаб',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/jobs?fields[0]=slug`
    );
    
    return response.data.data.map((job: JobData) => ({
      slug: job.slug,
    }));
  } catch (error) {
    console.error('Ошибка генерации статических параметров:', error);
    return [];
  }
}

export default async function SingleJobPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const jobData = await getJob(slug);
  
  if (!jobData) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const articleUrl = `${process.env.NEXT_PUBLIC_FRONTEND}/gta-online/jobs/${jobData.slug}`;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Хлебные крошки */}
        <nav className="flex mb-4 breadcrumb-nav" aria-label="Хлебные крошки">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 transition-colors">
                Главная
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link href="/gta-online" className="hover:text-gray-700 transition-colors">
                Хаб GTA Online
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link href="/gta-online/jobs" className="hover:text-gray-700 transition-colors">
                Дела
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-rockstar-500 font-medium">{jobData.title_ru}</span>
            </li>
          </ol>
        </nav>

        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            {`GTA Online — ${jobData?.title_ru}: Прохождение, описание и награды`}
          </h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            {/* Изображение дела */}
            <div className="flex items-center">
              <Image 
                src={`/${jobData.map_icon}`}
                alt={jobData.title_ru}
                width={64}
                height={64}
                className="mr-2"
              />
              <div>
                <h2 className="text-lg text-gray-300">{jobData.title_ru}</h2>
                <h2 className="text-lg text-gray-400">{jobData.title_en}</h2>
              </div>
            </div>

            {/* Кнопка Discord */}
            <a
              href="https://discord.gg/ppAAD626vM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center discord-button gap-3 bg-[#5865F2] px-4 py-3 rounded-lg hover:bg-[#4752c4] transition-colors duration-200 w-full md:w-auto justify-center"
            >
              <FaDiscord className="w-6 h-6" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm">Найти напарников</span>
                <span className="text-xs">На нашем Discord-сервере</span>
              </div>
            </a>
          </div>
        </div>

        {/* Объединенный блок: изображение + информация о деле */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Основное изображение - на мобильном сверху, на десктопе слева */}
          {jobData.cover_image && (
            <div className="w-full h-full">
              <Image 
                src={`${process.env.NEXT_PUBLIC_BACKEND}${jobData.cover_image.url}`}
                alt={jobData.title_ru}
                width={1280}
                height={720}
                className="w-full h-full object-cover rounded-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
          
          {/* Карточка с информацией о деле - на мобильном снизу, на десктопе справа */}
          <div className="card rounded-lg p-6 md:p-8 h-full">
            <h3 className="text-xl font-bold text-center mb-6">{jobData.series_title_ru} / {jobData.series_title_en}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Добавлено в игру:</h4>
                <p className="text-lg font-semibold">{formatDate(jobData.release_date)}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Количество игроков:</h4>
                <p className="text-lg font-semibold">{jobData.players}</p>
              </div>
              
              {/* Обновление DLC */}
              {(jobData.dlc_name_ru || jobData.dlc_name_en) && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Обновление:</h4>
                  <div>
                    {jobData.dlc_name_ru && (
                      <p className="text-lg font-semibold">{jobData.dlc_name_ru}</p>
                    )}
                    {jobData.dlc_name_en && jobData.dlc_name_en !== jobData.dlc_name_ru && (
                      <p className="text-sm text-gray-400">{jobData.dlc_name_en}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Требования */}
              {jobData.requirments && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Требования:</h4>
                  <p className="text-lg font-semibold">{jobData.requirments}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {jobData.youtube && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-8">Прохождение {jobData.title_ru}</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${jobData.youtube}`}
                title={`Видео-руководство как завершить дело «${jobData.title_ru}»`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-96 rounded-lg"
              ></iframe>
            </div>
          </div>
        )}

        {/* Описание дела */}
        {jobData.content && jobData.content.length > 0 && (
          <article className="card rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">Описание дела</h3>
            <div className="prose prose-lg max-w-none article-content">
              <BlocksRenderer content={jobData.content} />
            </div>
          </article>
        )}

        {/* Секции с наградами */}
        {jobData.awards && jobData.awards.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6 mt-6">Награды за завершение {jobData.title_ru}</h3>
            {jobData.awards.map((award) => (
              <AwardSection key={award.id} award={award} />
            ))}
          </div>
        )}

        {/* Кнопки поделиться */}
        <div className="p-6 md:p-8 mb-8">
          <div className="flex justify-end-safe items-center gap-4">
            <ShareButtons 
              url={articleUrl} 
              title={`${jobData.title_ru} - ${jobData.title_en} в GTA Online`} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}