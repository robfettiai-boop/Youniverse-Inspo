import { useState, useEffect } from 'react';
import { makeLettersColored } from '../utils/redR';

interface PopulationData {
  birthsToday: string;
  deathsToday: string;
}

export default function PopulationMeter() {
  const [data, setData] = useState<PopulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeBirths, setRealTimeBirths] = useState<number>(0);
  const [realTimeDeaths, setRealTimeDeaths] = useState<number>(0);

  useEffect(() => {
    fetchPopulationData();
    // Refresh actual data every 5 minutes
    const dataInterval = setInterval(fetchPopulationData, 5 * 60 * 1000);
    
    // Update real-time counters every second
    const realtimeInterval = setInterval(() => {
      // Approximate rates: ~4.3 births and ~2 deaths per second globally
      setRealTimeBirths(prev => prev + Math.floor(Math.random() * 8) + 2); // 2-9 births per second
      setRealTimeDeaths(prev => prev + Math.floor(Math.random() * 4) + 1);  // 1-4 deaths per second
    }, 1000);
    
    return () => {
      clearInterval(dataInterval);
      clearInterval(realtimeInterval);
    };
  }, []);

  useEffect(() => {
    // Initialize real-time counters when base data is loaded
    if (data && data.birthsToday !== 'N/A' && data.deathsToday !== 'N/A') {
      const births = parseInt(data.birthsToday.replace(/,/g, '')) || 0;
      const deaths = parseInt(data.deathsToday.replace(/,/g, '')) || 0;
      setRealTimeBirths(births);
      setRealTimeDeaths(deaths);
    }
  }, [data]);

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

  const formatNumber = (num: number) => {
    return num.toLocaleString();
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

  // Use real-time data if available, otherwise fall back to static data
  const displayBirths = realTimeBirths > 0 ? formatNumber(realTimeBirths) : (data?.birthsToday || 'N/A');
  const displayDeaths = realTimeDeaths > 0 ? formatNumber(realTimeDeaths) : (data?.deathsToday || 'N/A');

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
    </div>
  );
}