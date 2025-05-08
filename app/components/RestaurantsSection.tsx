'use client';

import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface Restaurant {
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  distance: string;
  address: string;
  url?: string;
}

export default function RestaurantsSection() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Note: You'll need to replace this with an actual restaurants API
        // For example, Yelp API or Google Places API
        const response = await fetch('/api/restaurants');
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        setError('Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

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
        <MapPinIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Nearby Restaurants</h2>
      </div>
      <div className="space-y-4">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant, index) => (
            <article key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-16 h-16 bg-orange-50 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      {renderStars(restaurant.rating)}
                      <span className="text-gray-600 ml-1">
                        {restaurant.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">{restaurant.priceRange}</p>
                    <p className="text-gray-500">{restaurant.distance} away</p>
                    <p className="text-gray-500 text-xs mt-1">{restaurant.address}</p>
                  </div>
                  {restaurant.url && (
                    <a
                      href={restaurant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                    >
                      View menu →
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-gray-500">No restaurants available</p>
        )}
      </div>
    </div>
  );
} 