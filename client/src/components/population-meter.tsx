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
  
  // Live counting states
  const [liveBirths, setLiveBirths] = useState<number>(0);
  const [liveDeaths, setLiveDeaths] = useState<number>(0);
  const [displayBirths, setDisplayBirths] = useState<string>("0");
  const [displayDeaths, setDisplayDeaths] = useState<string>("0");

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

  // Live counting animation - updates numbers continuously
  useEffect(() => {
    if (!data) return;

    const births = parseInt(data.birthsToday.replace(/,/g, ''));
    const deaths = parseInt(data.deathsToday.replace(/,/g, ''));
    
    // Set initial values
    setLiveBirths(births);
    setLiveDeaths(deaths);
    
    // Calculate rates per second (births and deaths continue throughout the day)
    const birthsPerSecond = births / (24 * 60 * 60); // Today's births divided by seconds in day
    const deathsPerSecond = deaths / (24 * 60 * 60); // Today's deaths divided by seconds in day
    
    const interval = setInterval(() => {
      setLiveBirths(prev => {
        const newBirths = prev + birthsPerSecond;
        setDisplayBirths(Math.round(newBirths).toLocaleString());
        return newBirths;
      });
      
      setLiveDeaths(prev => {
        const newDeaths = prev + deathsPerSecond;
        setDisplayDeaths(Math.round(newDeaths).toLocaleString());
        return newDeaths;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

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



  return (
    <div className="space-y-3 text-center" style={{ color: '#132448' }}>
      <div className="flex items-center justify-center gap-6">
        <div className="transition-all duration-300 inspiration-fade">
          <span className="font-mono text-lg font-medium tabular-nums">{`Births today: ${displayBirths}`}</span>
        </div>
        <div className="transition-all duration-300 inspiration-fade">
          <span className="font-mono text-lg font-medium tabular-nums">{`Deaths today: ${displayDeaths}`}</span>
        </div>
      </div>
      
      <div className="text-xs mt-2 inspiration-fade" style={{ color: '#132448', opacity: 0.7 }}>
        live update
      </div>
    </div>
  );
}