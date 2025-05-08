import { NextResponse } from 'next/server';

interface EventbriteEvent {
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  start: {
    local: string;
  };
  venue: {
    name: string;
    address: {
      localized_address_display: string;
    };
  };
  url: string;
  logo: {
    url: string;
  };
  is_free: boolean;
  ticket_availability: {
    minimum_ticket_price: {
      display: string;
    };
  };
  category_id: string;
  category: {
    name: string;
  };
}

interface Event {
  title: string;
  description: string;
  date: string;
  location: string;
  address: string;
  url?: string;
  imageUrl?: string;
  price?: string;
  category?: string;
}

export async function GET() {
  try {
    const API_KEY = process.env.EVENTBRITE_API_KEY;
    if (!API_KEY) {
      throw new Error('Eventbrite API key is not configured');
    }

    const location = 'San Francisco'; // You might want to get this from query params
    const radius = '50km'; // Search radius
    const sortBy = 'date'; // Sort by date
    const expand = 'venue,logo,category'; // Include additional fields

    // First, get the coordinates of the location using Google Maps Geocoding API
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key is not configured');
    }

    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const geocodeData = await geocodeResponse.json();
    const coordinates = geocodeData.results[0]?.geometry?.location;
    console.log(coordinates);

    if (!coordinates) {
      throw new Error('Could not find coordinates for the location');
    }

    // Fetch events from Eventbrite using the coordinates
    const response = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?` +
      `location.latitude=${coordinates.lat}&` +
      `location.longitude=${coordinates.lng}&` +
      `location.within=${radius}&` +
      `sort_by=${sortBy}&` +
      `expand=${expand}&` +
      `token=${API_KEY}`
    );

    if (!response.ok) {
      console.log(response);
      const errorData = await response.json();
      throw new Error(`Eventbrite API error: ${errorData.error_description || 'Unknown error'}`);
    }

    const data = await response.json();

    return NextResponse.json(
      data.events.map((event: EventbriteEvent) => ({
        title: event.name.text,
        description: event.description.text,
        date: event.start.local,
        location: event.venue?.name || 'Location TBA',
        address: event.venue?.address?.localized_address_display || '',
        url: event.url,
        imageUrl: event.logo?.url,
        price: event.is_free ? 'Free' : event.ticket_availability?.minimum_ticket_price?.display || 'Price varies',
        category: event.category_id ? event.category.name : 'General',
      }))
    );
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 