import { NextResponse } from 'next/server';

interface Event {
  title: string;
  description: string;
  date: string;
  location: string;
  url?: string;
}

export async function GET() {
  try {
    const API_KEY = process.env.EVENTBRITE_API_KEY;
    if (!API_KEY) {
      throw new Error('Eventbrite API key is not configured');
    }

    const city = 'San Francisco'; // You might want to get this from query params
    const response = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?location.address=${city}&expand=venue&token=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Events API request failed');
    }

    const data = await response.json();

    return NextResponse.json(
      data.events.map((event: any) => ({
        title: event.name.text,
        description: event.description.text,
        date: event.start.local,
        location: event.venue?.name || 'Location TBA',
        url: event.url,
      }))
    );
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 