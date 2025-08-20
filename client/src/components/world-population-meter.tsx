import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface PopulationData {
  birthsToday: string;
  deathsToday: string;
  timestamp: string;
  source: string;
  region: string;
  timezone: string;
  localTime: string;
}

export default function WorldPopulationMeter() {
  const [currentPopulation, setCurrentPopulation] = useState<number>(8150000000); // Starting estimate
  const [displayPopulation, setDisplayPopulation] = useState<string>("8,150,000,000");

  // Fetch population data every 10 seconds
  const { data: populationData } = useQuery<PopulationData>({
    queryKey: ["/api/population"],
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  // Calculate real-time population changes
  useEffect(() => {
    if (!populationData) return;

    const births = parseInt(populationData.birthsToday.replace(/,/g, ''));
    const deaths = parseInt(populationData.deathsToday.replace(/,/g, ''));
    const netChange = births - deaths;
    
    // Calculate change per second (assuming 24 hours)
    const changePerSecond = netChange / (24 * 60 * 60);

    const interval = setInterval(() => {
      setCurrentPopulation(prev => {
        const newPop = prev + changePerSecond;
        const formatted = Math.round(newPop).toLocaleString();
        setDisplayPopulation(formatted);
        return newPop;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [populationData]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-xs font-medium tracking-wider opacity-60" style={{ color: '#132448' }}>
        WORLD POPULATION
      </div>
      <div 
        className="text-xl font-bold tabular-nums world-population-counter"
        style={{ color: '#132448' }}
      >
        {displayPopulation}
      </div>
      <div className="text-xs opacity-50" style={{ color: '#132448' }}>
        Live Updates
      </div>
    </div>
  );
}