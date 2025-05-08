import WeatherSection from '@/components/WeatherSection';
import NewsSection from '@/components/NewsSection';
import EventsSection from '@/components/EventsSection';
import HikingSection from '@/components/HikingSection';
import RestaurantsSection from '@/components/RestaurantsSection';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">My Local</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeatherSection />
        <NewsSection />
        <EventsSection />
        <HikingSection />
        <RestaurantsSection />
      </div>
    </div>
  );
}
