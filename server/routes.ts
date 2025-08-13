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

  // Get population data from Worldometers using alternative approach
  app.get("/api/population", async (_req, res) => {
    try {
      // Try RapidAPI Worldometers endpoint first
      const rapidApiResponse = await fetch('https://worldometers.p.rapidapi.com/population', {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'demo-key',
          'X-RapidAPI-Host': 'worldometers.p.rapidapi.com'
        }
      });

      if (rapidApiResponse.ok) {
        const apiData = await rapidApiResponse.json();
        console.log('RapidAPI response:', apiData);
        
        if (apiData && (apiData.births_today || apiData.deaths_today)) {
          return res.json({
            birthsToday: apiData.births_today?.toString() || 'N/A',
            deathsToday: apiData.deaths_today?.toString() || 'N/A',
            timestamp: new Date().toISOString(),
            source: 'rapidapi-worldometers'
          });
        }
      }

      // Fallback: Generate realistic simulated data based on actual rates
      // Global birth rate: ~4.3/second, death rate: ~2/second (approximately)
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const secondsElapsedToday = Math.floor((now.getTime() - startOfDay.getTime()) / 1000);
      
      // Base numbers (approximate daily totals) + elapsed progress
      const baseBirths = 385000; // Approximate births per day globally
      const baseDeaths = 165000;  // Approximate deaths per day globally
      
      // Calculate progress through the day
      const birthsToday = Math.floor(baseBirths * (secondsElapsedToday / 86400)) + Math.floor(Math.random() * 1000);
      const deathsToday = Math.floor(baseDeaths * (secondsElapsedToday / 86400)) + Math.floor(Math.random() * 500);
      
      console.log('Generated realistic population data:', { birthsToday, deathsToday });
      
      res.json({
        birthsToday: birthsToday.toLocaleString(),
        deathsToday: deathsToday.toLocaleString(),
        timestamp: new Date().toISOString(),
        source: 'calculated-estimate'
      });
    } catch (error) {
      console.error('Error fetching population data:', error);
      
      // Emergency fallback with realistic numbers
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const secondsElapsedToday = Math.floor((now.getTime() - startOfDay.getTime()) / 1000);
      
      const birthsToday = Math.floor(385000 * (secondsElapsedToday / 86400));
      const deathsToday = Math.floor(165000 * (secondsElapsedToday / 86400));
      
      res.json({
        birthsToday: birthsToday.toLocaleString(),
        deathsToday: deathsToday.toLocaleString(),
        timestamp: new Date().toISOString(),
        source: 'fallback-estimate'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
