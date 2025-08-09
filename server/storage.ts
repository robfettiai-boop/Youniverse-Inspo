import { type User, type InsertUser, type Quote, type InsertQuote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllQuotes(): Promise<Quote[]>;
  getRandomQuote(): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quotes: Map<string, Quote>;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.seedQuotes();
  }

  private seedQuotes() {
    const seedData: InsertQuote[] = [
      {
        text: "The only way to do great work is to love what you do. Stay hungry, stay foolish, and never settle for mediocrity.",
        author: "Steve Jobs",
        category: "Success"
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "Perseverance"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        category: "Dreams"
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
        category: "Hope"
      },
      {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        category: "Action"
      },
      {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        category: "Leadership"
      },
      {
        text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        author: "Nelson Mandela",
        category: "Resilience"
      },
      {
        text: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon",
        category: "Life"
      },
      {
        text: "The future depends on what you do today.",
        author: "Mahatma Gandhi",
        category: "Action"
      },
      {
        text: "It is never too late to be what you might have been.",
        author: "George Eliot",
        category: "Potential"
      },
      {
        text: "Everything you've ever wanted is on the other side of fear.",
        author: "George Addair",
        category: "Courage"
      },
      {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        category: "Belief"
      },
      {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins",
        category: "Beginning"
      },
      {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein",
        category: "Opportunity"
      },
      {
        text: "Success is walking from failure to failure with no loss of enthusiasm.",
        author: "Winston Churchill",
        category: "Success"
      },
      {
        text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        author: "Ralph Waldo Emerson",
        category: "Inner Strength"
      },
      {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
        category: "Action"
      },
      {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
        category: "Persistence"
      },
      {
        text: "Whether you think you can or you think you can't, you're right.",
        author: "Henry Ford",
        category: "Mindset"
      },
      {
        text: "The only person you are destined to become is the person you decide to be.",
        author: "Ralph Waldo Emerson",
        category: "Self-Determination"
      }
    ];

    seedData.forEach(quote => {
      const id = randomUUID();
      const fullQuote: Quote = { ...quote, id };
      this.quotes.set(id, fullQuote);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    const allQuotes = Array.from(this.quotes.values());
    if (allQuotes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    return allQuotes[randomIndex];
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const quote: Quote = { ...insertQuote, id };
    this.quotes.set(id, quote);
    return quote;
  }
}

export const storage = new MemStorage();
