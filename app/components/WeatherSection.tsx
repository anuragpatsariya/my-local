'use client';

import { useState, useEffect } from 'react';
import { CloudIcon, SunIcon } from '@heroicons/react/24/outline';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
}

export default function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
      <h2 className="text-xl font-semibold mb-4">Local Weather</h2>
      {weather ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{weather.temperature}°C</p>
            <p className="text-gray-600">{weather.condition}</p>
            <p className="text-sm text-gray-500">{weather.location}</p>
          </div>
          <div className="text-4xl">
            {weather.condition && weather.condition.toLowerCase().includes('cloud') ? (
              <CloudIcon className="h-12 w-12 text-gray-400" />
            ) : (
              <SunIcon className="h-12 w-12 text-yellow-400" />
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No weather data available</p>
      )}
    </div>
  );
} 