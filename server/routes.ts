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

  // Get population data from Worldometers
  app.get("/api/population", async (_req, res) => {
    try {
      const response = await fetch('https://www.worldometers.info/world-population/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const html = await response.text();
      
      // Try multiple patterns to extract births and deaths today
      let birthsToday = 'N/A';
      let deathsToday = 'N/A';
      
      // Pattern 1: Look for the exact structure from the website
      const birthsMatch1 = html.match(/Births today[\s\S]*?<div[^>]*>[\s]*([0-9,]+)/i);
      const deathsMatch1 = html.match(/Deaths today[\s\S]*?<div[^>]*>[\s]*([0-9,]+)/i);
      
      // Pattern 2: Alternative structure
      const birthsMatch2 = html.match(/births.*today.*?([0-9,]+)/i);
      const deathsMatch2 = html.match(/deaths.*today.*?([0-9,]+)/i);
      
      // Pattern 3: Look in script tags for dynamic content
      const scriptMatch = html.match(/<script[^>]*>[\s\S]*births.*?([0-9,]+)[\s\S]*deaths.*?([0-9,]+)[\s\S]*<\/script>/i);
      
      if (birthsMatch1) birthsToday = birthsMatch1[1];
      else if (birthsMatch2) birthsToday = birthsMatch2[1];
      else if (scriptMatch) birthsToday = scriptMatch[1];
      
      if (deathsMatch1) deathsToday = deathsMatch1[1];
      else if (deathsMatch2) deathsToday = deathsMatch2[1];
      else if (scriptMatch && scriptMatch[2]) deathsToday = scriptMatch[2];
      
      console.log('Population data extracted:', { birthsToday, deathsToday });
      
      res.json({
        birthsToday,
        deathsToday
      });
    } catch (error) {
      console.error('Error fetching population data:', error);
      res.status(500).json({ error: 'Failed to fetch population data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
