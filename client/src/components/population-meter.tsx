import { useState, useEffect } from 'react';
import { makeLettersColored } from '../utils/redR';

interface PopulationData {
  birthsToday: string;
  deathsToday: string;
}

export default function PopulationMeter() {
  const [data, setData] = useState<PopulationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopulationData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchPopulationData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPopulationData = async () => {
    try {
      const response = await fetch('/api/population');
      if (response.ok) {
        const populationData = await response.json();
        setData(populationData);
      }
    } catch (error) {
      console.error('Error fetching population data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-xs text-gray-400 space-y-1">
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="text-xs text-gray-500 space-y-1 text-center">
      <div className="flex items-center justify-center gap-4">
        <div>
          <span className="text-green-600">↑ </span>
          <span>{makeLettersColored(`Born today: ${data.birthsToday}`)}</span>
        </div>
        <div>
          <span className="text-red-400">↓ </span>
          <span>{makeLettersColored(`Died today: ${data.deathsToday}`)}</span>
        </div>
      </div>
      <div className="text-xs text-gray-400">
        {makeLettersColored('Global population data')}
      </div>
    </div>
  );
}