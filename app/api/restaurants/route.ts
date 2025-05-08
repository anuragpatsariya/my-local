import { NextResponse } from 'next/server';

interface Restaurant {
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  distance: string;
  address: string;
  url?: string;
}

export async function GET() {
  try {
    const API_KEY = process.env.YELP_API_KEY;
    if (!API_KEY) {
      throw new Error('Yelp API key is not configured');
    }

    const location = 'San Francisco'; // You might want to get this from query params
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?location=${location}&term=restaurants&sort_by=rating&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Restaurants API request failed');
    }

    const data = await response.json();

    return NextResponse.json(
      data.businesses.map((business: any) => ({
        name: business.name,
        cuisine: business.categories[0]?.title || 'Restaurant',
        rating: business.rating,
        priceRange: business.price || '$$',
        distance: `${(business.distance / 1609.34).toFixed(1)} miles`,
        address: business.location.address1,
        url: business.url,
      }))
    );
  } catch (error) {
    console.error('Restaurants API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
} 