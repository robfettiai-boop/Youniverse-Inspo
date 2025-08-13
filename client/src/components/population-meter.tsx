import { useState, useEffect } from 'react';
import { makeLettersColored } from '../utils/redR';

interface PopulationData {
  birthsToday: string;
  deathsToday: string;
  timestamp?: string;
  source?: string;
}

export default function PopulationMeter() {
  const [data, setData] = useState<PopulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Initial fetch
    fetchPopulationData();
    
    // Fetch fresh data every 10 seconds to show more frequent updates
    const dataInterval = setInterval(fetchPopulationData, 10 * 1000);
    
    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  const fetchPopulationData = async () => {
    try {
      const response = await fetch('/api/population?' + new Date().getTime()); // Cache busting
      if (response.ok) {
        const populationData = await response.json();
        console.log('Fresh population data:', populationData);
        setData(populationData);
        setLastUpdate(new Date());
      } else {
        console.error('Failed to fetch population data:', response.status, response.statusText);
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

  // Use exact data from Worldometers - no simulation
  const displayBirths = data?.birthsToday || 'Loading...';
  const displayDeaths = data?.deathsToday || 'Loading...';

  return (
    <div className="text-xs text-gray-500 space-y-1 text-center">
      <div className="flex items-center justify-center gap-4">
        <div className="transition-all duration-300">
          <span className="font-mono">{makeLettersColored(`Births today: ${displayBirths}`)}</span>
        </div>
        <div className="transition-all duration-300">
          <span className="font-mono">{makeLettersColored(`Deaths today: ${displayDeaths}`)}</span>
        </div>
      </div>
      {data?.source && (
        <div className="text-xs text-gray-400 mt-1">
          {makeLettersColored(`Updated: ${lastUpdate.toLocaleTimeString()}`)}
        </div>
      )}
    </div>
  );
}