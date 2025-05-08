'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Image from 'next/image';

interface HikingSpot {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  photos?: string[];
  description: string;
  placeId: string;
}

interface HikingMapProps {
  hikingSpots: HikingSpot[];
}

export default function HikingMap({ hikingSpots }: HikingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<HikingSpot | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places'],
      });

      try {
        const google = await loader.load();
        
        // Initialize map centered on San Francisco
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        mapInstanceRef.current = map;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add markers for each hiking spot
        hikingSpots.forEach(spot => {
          const marker = new google.maps.Marker({
            position: { lat: spot.latitude, lng: spot.longitude },
            map,
            title: spot.name,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            },
          });

          marker.addListener('click', () => {
            setSelectedSpot(spot);
          });

          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [hikingSpots]);

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {selectedSpot && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">{selectedSpot.name}</h3>
          <p className="text-gray-600 mb-2">{selectedSpot.description}</p>
          
          {selectedSpot.photos && selectedSpot.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {selectedSpot.photos.map((photo, index) => (
                <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={photo}
                    alt={`${selectedSpot.name} photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-yellow-400">★</span>
            <span>{selectedSpot.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{selectedSpot.location}</span>
          </div>

          <a
            href={`https://www.google.com/maps/place/?q=place_id:${selectedSpot.placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm"
          >
            View on Google Maps →
          </a>
        </div>
      )}
    </div>
  );
} 