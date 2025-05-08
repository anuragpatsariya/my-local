import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    if (!API_KEY) {
      throw new Error('News API key is not configured');
    }

    const city = 'San Francisco'; // You might want to get this from query params
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${city}&apiKey=${API_KEY}&language=en&sortBy=publishedAt&pageSize=5`
    );

    if (!response.ok) {
      throw new Error('News API request failed');
    }

    const data = await response.json();

    return NextResponse.json(
      data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
      }))
    );
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 