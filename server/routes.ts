import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema } from "@shared/schema";

// Fetch real-time population data from Worldometers.info
async function fetchWorldometersData(): Promise<{
  success: boolean;
  currentPopulation?: string;
  birthsToday?: string;
  deathsToday?: string;
  error?: string;
}> {
  try {
    const response = await fetch('https://www.worldometers.info/world-population/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Extract population data using improved regex patterns
    const currentPopMatch = html.match(/id="world-population"[^>]*>([^<]+)/i) || 
                           html.match(/class="counter-number"[^>]*>([^<]+)/i);
    const birthsMatch = html.match(/id="births_today"[^>]*>([^<]+)/i) || 
                       html.match(/births.*?counter-number[^>]*>([^<]+)/i);
    const deathsMatch = html.match(/id="deaths_today"[^>]*>([^<]+)/i) || 
                       html.match(/deaths.*?counter-number[^>]*>([^<]+)/i);
    
    const currentPopulation = currentPopMatch?.[1]?.trim().replace(/\D/g, '') || '';
    const birthsToday = birthsMatch?.[1]?.trim().replace(/\D/g, '') || '';
    const deathsToday = deathsMatch?.[1]?.trim().replace(/\D/g, '') || '';
    
    console.log('Worldometers extraction:', { currentPopulation, birthsToday, deathsToday });
    
    if (currentPopulation && birthsToday && deathsToday) {
      return {
        success: true,
        currentPopulation: parseInt(currentPopulation).toLocaleString(),
        birthsToday: parseInt(birthsToday).toLocaleString(),
        deathsToday: parseInt(deathsToday).toLocaleString()
      };
    }
    
    throw new Error('Could not extract population data from page');
    
  } catch (error) {
    console.error('Error fetching Worldometers data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get random quote
  app.get("/api/quotes/random", async (_req, res) => {
    try {
      const quote = await storage.getRandomQuote();
      if (!quote) {
        return res.status(404).json({ error: "No quotes available" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quote" });
    }
  });

  // Get all quotes
  app.get("/api/quotes", async (_req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  // Create new quote (for future admin functionality)
  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(validatedData);
      res.status(201).json(quote);
    } catch (error) {
      res.status(400).json({ error: "Invalid quote data" });
    }
  });

  // Get population data with regional/timezone customization
  app.get("/api/population", async (req, res) => {
    try {
      // Get timezone from query parameter (sent by frontend)
      const timezone = req.query.timezone as string || 'UTC';
      const region = req.query.region as string || 'global';
      
      console.log('Population request:', { timezone, region });

      // Try to get real-time data from Worldometers.info
      const worldometersData = await fetchWorldometersData();
      
      if (worldometersData.success && worldometersData.birthsToday && worldometersData.deathsToday) {
        console.log('Got real Worldometers data:', worldometersData);
        
        // Apply regional scaling if not global
        const scaleFactor = getRegionalScaleFactor(region);
        const rawBirths = parseInt(worldometersData.birthsToday.replace(/,/g, ''));
        const rawDeaths = parseInt(worldometersData.deathsToday.replace(/,/g, ''));
        
        const birthsToday = Math.floor(rawBirths * scaleFactor);
        const deathsToday = Math.floor(rawDeaths * scaleFactor);
        
        return res.json({
          birthsToday: birthsToday.toLocaleString(),
          deathsToday: deathsToday.toLocaleString(),
          currentPopulation: worldometersData.currentPopulation,
          timestamp: new Date().toISOString(),
          source: 'worldometers.info-live',
          region: region,
          timezone: timezone
        });
      }

      console.log('Worldometers data failed, using calculated data:', worldometersData.error);

      // Fallback: Generate global numbers but calculated based on user's local timezone
      const globalData = calculateGlobalPopulationForTimezone(timezone);
      
      console.log('Generated global population data for timezone:', timezone, globalData);
      
      res.json({
        birthsToday: globalData.births.toLocaleString(),
        deathsToday: globalData.deaths.toLocaleString(),
        timestamp: new Date().toISOString(),
        source: 'global-timezone-estimate',
        region: 'World',
        timezone: timezone,
        localTime: globalData.localTime
      });
    } catch (error) {
      console.error('Error fetching population data:', error);
      
      // Emergency fallback - still use global numbers based on timezone
      const fallbackData = calculateGlobalPopulationForTimezone(
        req.query.timezone as string || 'UTC'
      );
      
      res.json({
        birthsToday: fallbackData.births.toLocaleString(),
        deathsToday: fallbackData.deaths.toLocaleString(),
        timestamp: new Date().toISOString(),
        source: 'fallback-global-timezone',
        region: 'World',
        timezone: fallbackData.timezone
      });
    }
  });

  // Helper function to get regional population scaling factors
  function getRegionalScaleFactor(region: string): number {
    const scalingFactors: Record<string, number> = {
      'global': 1.0,
      'asia': 0.59,      // ~59% of world population
      'africa': 0.17,    // ~17% of world population  
      'europe': 0.10,    // ~10% of world population
      'north-america': 0.08, // ~8% of world population
      'south-america': 0.05, // ~5% of world population
      'oceania': 0.01,   // ~1% of world population
      'china': 0.18,     // ~18% of world population
      'india': 0.17,     // ~17% of world population
      'usa': 0.04,       // ~4% of world population
      'japan': 0.016,    // ~1.6% of world population
      'uk': 0.009,       // ~0.9% of world population
      'germany': 0.01,   // ~1% of world population
    };
    
    return scalingFactors[region.toLowerCase()] || 1.0;
  }

  // Helper function to calculate regional population data based on timezone
  function calculateRegionalPopulationData(timezone: string, region: string) {
    // Determine region from timezone if not specified
    let detectedRegion = region;
    let regionName = 'Global';
    
    if (region === 'global' || !region) {
      // Auto-detect region from timezone
      if (timezone.includes('America') || timezone.includes('US') || timezone.includes('Canada')) {
        detectedRegion = 'north-america';
        regionName = 'North America';
      } else if (timezone.includes('Europe') || timezone.includes('London') || timezone.includes('Berlin')) {
        detectedRegion = 'europe';
        regionName = 'Europe';
      } else if (timezone.includes('Asia') || timezone.includes('Tokyo') || timezone.includes('Shanghai')) {
        detectedRegion = 'asia';
        regionName = 'Asia';
      } else if (timezone.includes('Africa')) {
        detectedRegion = 'africa';
        regionName = 'Africa';
      } else if (timezone.includes('Australia') || timezone.includes('Pacific')) {
        detectedRegion = 'oceania';
        regionName = 'Oceania';
      }
    } else {
      // Use specified region
      const regionNames: Record<string, string> = {
        'asia': 'Asia',
        'africa': 'Africa',
        'europe': 'Europe',
        'north-america': 'North America',
        'south-america': 'South America',
        'oceania': 'Oceania',
        'china': 'China',
        'india': 'India',
        'usa': 'United States',
        'japan': 'Japan',
        'uk': 'United Kingdom',
        'germany': 'Germany'
      };
      regionName = regionNames[region.toLowerCase()] || 'Global';
    }

    // Calculate time in specified timezone
    const now = new Date();
    let localTime: Date;
    
    try {
      // Create date in specified timezone
      localTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    } catch {
      localTime = now; // Fallback to UTC if timezone is invalid
    }
    
    const startOfDay = new Date(localTime.getFullYear(), localTime.getMonth(), localTime.getDate());
    const secondsElapsedToday = Math.floor((localTime.getTime() - startOfDay.getTime()) / 1000);
    
    // Get regional scaling factor
    const scaleFactor = getRegionalScaleFactor(detectedRegion);
    
    // Base global numbers scaled by region
    const baseBirths = Math.floor(385000 * scaleFactor); // Daily births for region
    const baseDeaths = Math.floor(165000 * scaleFactor); // Daily deaths for region
    
    // Calculate progress through the local day with some randomness
    const births = Math.floor(baseBirths * (secondsElapsedToday / 86400)) + 
                   Math.floor(Math.random() * Math.max(10, baseBirths * 0.01));
    const deaths = Math.floor(baseDeaths * (secondsElapsedToday / 86400)) + 
                   Math.floor(Math.random() * Math.max(5, baseDeaths * 0.01));
    
    return {
      births,
      deaths,
      regionName,
      detectedRegion,
      localTime: localTime.toISOString()
    };
  }

  // Helper function to calculate global population data based on user's timezone  
  function calculateGlobalPopulationForTimezone(timezone: string) {
    // Calculate time in specified timezone
    const now = new Date();
    let localTime: Date;
    
    try {
      // Create date in specified timezone
      localTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    } catch {
      localTime = now; // Fallback to UTC if timezone is invalid
    }
    
    const startOfDay = new Date(localTime.getFullYear(), localTime.getMonth(), localTime.getDate());
    const secondsElapsedToday = Math.floor((localTime.getTime() - startOfDay.getTime()) / 1000);
    
    // Global numbers (full world population)
    const baseBirths = 385000; // Global births per day
    const baseDeaths = 165000;  // Global deaths per day
    
    // Calculate progress through the user's local day with some randomness
    const births = Math.floor(baseBirths * (secondsElapsedToday / 86400)) + 
                   Math.floor(Math.random() * 1000);
    const deaths = Math.floor(baseDeaths * (secondsElapsedToday / 86400)) + 
                   Math.floor(Math.random() * 500);
    
    return {
      births,
      deaths,
      localTime: localTime.toISOString(),
      timezone: timezone
    };
  }

  const httpServer = createServer(app);
  return httpServer;
}
