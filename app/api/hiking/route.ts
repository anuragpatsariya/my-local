import { NextResponse } from 'next/server';

interface HikingSpot {
  name: string;
  description: string;
  distance: string;
  rating: number;
  location: string;
  latitude: number;
  longitude: number;
  placeId: string;
  photos?: string[];
  difficulty?: 'Easy' | 'Moderate' | 'Hard';
}

export async function GET() {
  try {
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key is not configured');
    }

    const location = 'Sunnyvale+CA'; // You might want to get this from query params
    const radius = 50000; // 50km radius

    // First, get the coordinates of the location
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const geocodeData = await geocodeResponse.json();
    const coordinates = geocodeData.results[0]?.geometry?.location;

    if (!coordinates) {
      throw new Error('Could not find coordinates for the location');
    }

    // Search for hiking trails and parks using Places API
    const placesResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&type=park&keyword=hiking&key=${GOOGLE_MAPS_API_KEY}`
    );

    const placesData = await placesResponse.json();

    if (!placesData.results) {
      throw new Error('Failed to fetch places data');
    }

    // Get detailed information for each place
    const hikingSpots = await Promise.all(
      placesData.results.map(async (place: any) => {
        // Get place details
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,rating,reviews,photos,url&key=${GOOGLE_MAPS_API_KEY}`
        );

        const detailsData = await detailsResponse.json();
        const details = detailsData.result;

        // Get photos URLs
        const photos = details.photos?.slice(0, 3).map((photo: any) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
        );

        return {
          name: place.name,
          description: place.vicinity,
          distance: 'Distance will be calculated on the client side',
          rating: place.rating || 0,
          location: place.vicinity,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          placeId: place.place_id,
          photos,
          difficulty: 'Moderate', // This would need to be determined from reviews or additional data
        };
      })
    );

    return NextResponse.json(hikingSpots);
  } catch (error) {
    console.error('Hiking API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hiking spots' },
      { status: 500 }
    );
  }
} 