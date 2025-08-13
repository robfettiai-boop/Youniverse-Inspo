import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema } from "@shared/schema";

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

  // Get population data from Worldometers with better parsing
  app.get("/api/population", async (_req, res) => {
    try {
      const response = await fetch('https://www.worldometers.info/world-population/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log('Fetched HTML length:', html.length);
      
      // Extract births and deaths with more precise patterns
      let birthsToday = 'N/A';
      let deathsToday = 'N/A';
      
      // Look for the Today section specifically
      const todaySection = html.match(/Today[\s\S]*?This Year/i);
      if (todaySection) {
        const todayContent = todaySection[0];
        
        // Extract births from Today section
        const birthsPattern = /Births today[\s\S]*?<[^>]*class="[^"]*"[^>]*>\s*([0-9,]+)/i;
        const birthsMatch = todayContent.match(birthsPattern);
        if (birthsMatch) {
          birthsToday = birthsMatch[1];
        } else {
          // Fallback pattern
          const birthsFallback = todayContent.match(/births[\s\S]*?([0-9,]{3,})/i);
          if (birthsFallback) birthsToday = birthsFallback[1];
        }
        
        // Extract deaths from Today section  
        const deathsPattern = /Deaths today[\s\S]*?<[^>]*class="[^"]*"[^>]*>\s*([0-9,]+)/i;
        const deathsMatch = todayContent.match(deathsPattern);
        if (deathsMatch) {
          deathsToday = deathsMatch[1];
        } else {
          // Fallback pattern
          const deathsFallback = todayContent.match(/deaths[\s\S]*?([0-9,]{3,})/i);
          if (deathsFallback) deathsToday = deathsFallback[1];
        }
      }
      
      // If still N/A, try global patterns
      if (birthsToday === 'N/A') {
        const globalBirthsMatch = html.match(/births.*today.*?([0-9,]{3,})/i);
        if (globalBirthsMatch) birthsToday = globalBirthsMatch[1];
      }
      
      if (deathsToday === 'N/A') {
        const globalDeathsMatch = html.match(/deaths.*today.*?([0-9,]{3,})/i);
        if (globalDeathsMatch) deathsToday = globalDeathsMatch[1];
      }
      
      console.log('Population data extracted:', { birthsToday, deathsToday });
      
      // Add timestamp for freshness
      const timestamp = new Date().toISOString();
      
      res.json({
        birthsToday,
        deathsToday,
        timestamp,
        source: 'worldometers.info'
      });
    } catch (error) {
      console.error('Error fetching population data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch population data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
