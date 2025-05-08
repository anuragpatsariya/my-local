'use client';

import { useState, useEffect } from 'react';
import { NewspaperIcon } from '@heroicons/react/24/outline';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Note: You'll need to replace this with an actual news API
        // For example, NewsAPI or a local news RSS feed
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <NewspaperIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Local News</h2>
      </div>
      <div className="space-y-4">
        {news.length > 0 ? (
          news.map((item, index) => (
            <article key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <time className="text-xs text-gray-500 mt-1 block">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </time>
              </a>
            </article>
          ))
        ) : (
          <p className="text-gray-500">No news available</p>
        )}
      </div>
    </div>
  );
} 