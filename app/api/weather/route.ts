import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error('Weather API key is not configured');
    }

    const city = 'San Francisco'; // You might want to get this from query params
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

    return NextResponse.json({
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      location: data.name,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 