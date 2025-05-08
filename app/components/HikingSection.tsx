'use client';

import { useState, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import HikingMap from './HikingMap';

interface HikingSpot {
  name: string;
  description: string;
  location: string;
  rating: number;
  latitude: number;
  longitude: number;
  placeId: string;
  photos?: string[];
}

export default function HikingSection() {
  const [hikingSpots, setHikingSpots] = useState<HikingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHikingSpots = async () => {
      try {
        const response = await fetch('/api/hiking');
        if (!response.ok) {
          throw new Error('Failed to fetch hiking spots');
        }
        const data = await response.json();
        setHikingSpots(data);
      } catch (error) {
        setError('Failed to fetch hiking spots');
        console.error('Error fetching hiking spots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHikingSpots();
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
        <MapPinIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Hiking Spots</h2>
      </div>
      
      <HikingMap hikingSpots={hikingSpots} />
    </div>
  );
} 