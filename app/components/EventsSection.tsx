'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, TagIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Image from 'next/image';

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

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
        <CalendarIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Local Events</h2>
      </div>
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event, index) => (
            <article key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start gap-3">
                {event.imageUrl ? (
                  <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="h-8 w-8 text-blue-500" />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="font-medium mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>{format(new Date(event.date), 'MMM d, yyyy h:mm a')}</p>
                    <div className="flex items-start gap-1">
                      <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{event.location}</p>
                        {event.address && (
                          <p className="text-gray-600">{event.address}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {event.category && (
                        <div className="flex items-center gap-1">
                          <TagIcon className="h-4 w-4" />
                          <span>{event.category}</span>
                        </div>
                      )}
                      {event.price && (
                        <div className="flex items-center gap-1">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>{event.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-gray-500">No events available</p>
        )}
      </div>
    </div>
  );
} 