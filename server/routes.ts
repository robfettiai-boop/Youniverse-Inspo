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
      const response = await fetch('https://www.worldometers.info/world-population/');
      const html = await response.text();
      
      // Extract births and deaths today using regex
      const birthsMatch = html.match(/Births today\s*<\/div>\s*<div[^>]*>\s*([0-9,]+)/i);
      const deathsMatch = html.match(/Deaths today\s*<\/div>\s*<div[^>]*>\s*([0-9,]+)/i);
      
      const birthsToday = birthsMatch ? birthsMatch[1] : 'N/A';
      const deathsToday = deathsMatch ? deathsMatch[1] : 'N/A';
      
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
