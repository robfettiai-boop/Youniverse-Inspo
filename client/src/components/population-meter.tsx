import { useState, useEffect } from 'react';

interface PopulationData {
  birthsToday: string;
  deathsToday: string;
  timestamp?: string;
  source?: string;
  region?: string;
  timezone?: string;
}

export default function PopulationMeter() {
  const [data, setData] = useState<PopulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [userRegion, setUserRegion] = useState<string>('');

  // Detect user's timezone and region
  useEffect(() => {
    // Get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
    
    // Try to get country/region from timezone or browser
    let detectedRegion = 'global';
    
    // Auto-detect region from timezone
    if (timezone.includes('America') || timezone.includes('US') || timezone.includes('Canada')) {
      detectedRegion = 'north-america';
    } else if (timezone.includes('Europe') || timezone.includes('London') || timezone.includes('Berlin')) {
      detectedRegion = 'europe';
    } else if (timezone.includes('Asia')) {
      if (timezone.includes('Tokyo')) detectedRegion = 'japan';
      else if (timezone.includes('Shanghai') || timezone.includes('Hong_Kong')) detectedRegion = 'china';
      else detectedRegion = 'asia';
    } else if (timezone.includes('Africa')) {
      detectedRegion = 'africa';
    } else if (timezone.includes('Australia') || timezone.includes('Pacific')) {
      detectedRegion = 'oceania';
    }
    
    // Try to get more specific country info from navigator
    if (navigator.language) {
      const lang = navigator.language.toLowerCase();
      if (lang.includes('us') || lang.includes('en-us')) detectedRegion = 'usa';
      else if (lang.includes('gb') || lang.includes('en-gb')) detectedRegion = 'uk';
      else if (lang.includes('de')) detectedRegion = 'germany';
      else if (lang.includes('ja')) detectedRegion = 'japan';
      else if (lang.includes('zh')) detectedRegion = 'china';
      else if (lang.includes('hi')) detectedRegion = 'india';
    }
    
    setUserRegion(detectedRegion);
    console.log('Detected timezone:', timezone, 'region:', detectedRegion);
  }, []);

  useEffect(() => {
    // Only start fetching when we have timezone info
    if (userTimezone) {
      // Initial fetch
      fetchPopulationData();
      
      // Fetch fresh data every 10 seconds to show more frequent updates
      const dataInterval = setInterval(fetchPopulationData, 10 * 1000);
      
      return () => {
        clearInterval(dataInterval);
      };
    }
  }, [userTimezone, userRegion]);

  const fetchPopulationData = async () => {
    try {
      // Include timezone and region in the request
      const params = new URLSearchParams({
        timezone: userTimezone || 'UTC',
        region: userRegion || 'global',
        t: new Date().getTime().toString() // Cache busting
      });
      
      const response = await fetch(`/api/population?${params}`);
      if (response.ok) {
        const populationData = await response.json();
        console.log('Fresh regional population data:', populationData);
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
    <div className="text-gray-600 space-y-3 text-center">
      <div className="flex items-center justify-center gap-6">
        <div className="transition-all duration-300">
          <span className="font-mono text-lg font-medium">{`Births today: ${displayBirths}`}</span>
        </div>
        <div className="transition-all duration-300">
          <span className="font-mono text-lg font-medium">{`Deaths today: ${displayDeaths}`}</span>
        </div>
      </div>
      
      {data?.source && (
        <div className="text-xs text-gray-400 mt-2">
          {`Updated: ${lastUpdate.toLocaleTimeString()}`}
        </div>
      )}
    </div>
  );
}