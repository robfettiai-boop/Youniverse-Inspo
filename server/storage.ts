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
  private dailyQuoteHistory: Map<string, Set<string>> = new Map(); // date -> set of shown quote IDs
  private lastCleanup: string = '';

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.seedQuotes();
  }


  private seedQuotes() {
    const seedData: InsertQuote[] = [
      // Success & Achievement
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Success" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Perseverance" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Leadership" },
      { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "Success" },
      { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Action" },
      { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "Excellence" },
      { text: "The road to success is always under construction.", author: "Lily Tomlin", category: "Success" },
      { text: "Success is not how high you have climbed, but how you make a positive difference to the world.", author: "Roy T. Bennett", category: "Impact" },
      
      // Dreams & Vision
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
      { text: "All our dreams can come true if we have the courage to pursue them.", author: "Walt Disney", category: "Dreams" },
      { text: "A dream doesn't become reality through magic; it takes sweat, determination and hard work.", author: "Colin Powell", category: "Dreams" },
      { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey", category: "Dreams" },
      { text: "Dream big and dare to fail.", author: "Norman Vaughan", category: "Dreams" },
      { text: "Your only limit is your mind.", author: "Anonymous", category: "Mindset" },
      
      // Courage & Fear
      { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "Courage" },
      { text: "Courage is not the absence of fear, but rather the assessment that something else is more important than fear.", author: "Franklin D. Roosevelt", category: "Courage" },
      { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "Courage" },
      { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell", category: "Courage" },
      { text: "Fear is a reaction. Courage is a decision.", author: "Winston Churchill", category: "Courage" },
      { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt", category: "Courage" },
      
      // Growth & Learning
      { text: "It is never too late to be what you might have been.", author: "George Eliot", category: "Potential" },
      { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "Self-Determination" },
      { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "Authenticity" },
      { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll", category: "Mindset" },
      { text: "The mind is everything. What you think you become.", author: "Buddha", category: "Mindset" },
      { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", category: "Mindset" },
      { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale", category: "Mindset" },
      
      // Perseverance & Resilience
      { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "Resilience" },
      { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "Hope" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Persistence" },
      { text: "Fall seven times, stand up eight.", author: "Japanese Proverb", category: "Resilience" },
      { text: "Difficult roads often lead to beautiful destinations.", author: "Zig Ziglar", category: "Perseverance" },
      { text: "The comeback is always stronger than the setback.", author: "Anonymous", category: "Resilience" },
      
      // Action & Beginning
      { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Beginning" },
      { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Action" },
      { text: "You don't have to be great to get started, but you have to get started to be great.", author: "Les Brown", category: "Beginning" },
      { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu", category: "Beginning" },
      { text: "The future depends on what you do today.", author: "Mahatma Gandhi", category: "Action" },
      { text: "Don't wait for opportunity. Create it.", author: "Anonymous", category: "Action" },
      
      // Opportunity & Growth
      { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Opportunity" },
      { text: "Opportunities don't happen. You create them.", author: "Chris Grosser", category: "Opportunity" },
      { text: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.", author: "Winston Churchill", category: "Opportunity" },
      { text: "When one door of happiness closes, another opens.", author: "Helen Keller", category: "Opportunity" },
      
      // Belief & Confidence
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Belief" },
      { text: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.", author: "Christian D. Larson", category: "Belief" },
      { text: "If you believe it will work out, you'll see opportunities. If you believe it won't, you will see obstacles.", author: "Wayne Dyer", category: "Belief" },
      
      // Inner Strength
      { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "Inner Strength" },
      { text: "You have been assigned this mountain to show others it can be moved.", author: "Mel Robbins", category: "Inner Strength" },
      { text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.", author: "Rikki Rogers", category: "Inner Strength" },
      { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", category: "Inner Strength" },
      
      // Life & Purpose
      { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: "Life" },
      { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "Life" },
      { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "Life" },
      { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr.", category: "Life" },
      { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi", category: "Change" },
      
      // Wisdom & Perspective
      { text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.", author: "Bill Keane", category: "Wisdom" },
      { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "Wisdom" },
      { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Persistence" },
      { text: "The unexamined life is not worth living.", author: "Socrates", category: "Wisdom" },
      
      // Motivation & Energy  
      { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin", category: "Persistence" },
      { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson", category: "Excellence" },
      { text: "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.", author: "Aristotle", category: "Excellence" },
      { text: "Don't limit your challenges, challenge your limits.", author: "Anonymous", category: "Growth" },
      
      // Focus & Discipline
      { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn", category: "Discipline" },
      { text: "The successful warrior is the average man with laser-like focus.", author: "Bruce Lee", category: "Focus" },
      { text: "Where focus goes, energy flows and results show.", author: "T. Harv Eker", category: "Focus" },
      { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell", category: "Focus" },
      
      // Innovation & Creativity
      { text: "Creativity is intelligence having fun.", author: "Albert Einstein", category: "Creativity" },
      { text: "Think outside the box, collapse the box, and take a sharp knife to it.", author: "Banksy", category: "Creativity" },
      
      // Leadership & Impact
      { text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell", category: "Leadership" },
      { text: "The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.", author: "Ronald Reagan", category: "Leadership" },
      { text: "Management is doing things right; leadership is doing the right things.", author: "Peter Drucker", category: "Leadership" },
      { text: "You don't need a title to be a leader.", author: "Anonymous", category: "Leadership" },
      
      // Time & Priorities
      { text: "Time is what we want most, but what we use worst.", author: "William Penn", category: "Time" },
      { text: "Don't spend time beating on a wall, hoping to transform it into a door.", author: "Coco Chanel", category: "Wisdom" },
      { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey", category: "Priorities" },
      { text: "Lost time is never found again.", author: "Benjamin Franklin", category: "Time" },
      
      // Gratitude & Positivity
      { text: "Gratitude turns what we have into enough.", author: "Anonymous", category: "Gratitude" },
      { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman", category: "Positivity" },
      { text: "Positive anything is better than negative nothing.", author: "Elbert Hubbard", category: "Positivity" },
      { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts", category: "Change" },
      
      // Additional Powerful Quotes
      { text: "Success is not just about what you accomplish in your life, it's about what you inspire others to do.", author: "Anonymous", category: "Success" },
      { text: "The difference between winning and losing is most often not quitting.", author: "Walt Disney", category: "Persistence" },
      { text: "Your limitation—it's only your imagination.", author: "Anonymous", category: "Mindset" },
      { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous", category: "Motivation" },
      { text: "Great things never come from comfort zones.", author: "Anonymous", category: "Growth" },
      { text: "Don't stop when you're tired. Stop when you're done.", author: "Anonymous", category: "Persistence" },
      { text: "Wake up with determination. Go to bed with satisfaction.", author: "Anonymous", category: "Motivation" },
      { text: "Do something today that your future self will thank you for.", author: "Sean Croxton", category: "Action" },
      { text: "Little things make big days.", author: "Anonymous", category: "Motivation" },
      { text: "It's going to be hard, but hard does not mean impossible.", author: "Anonymous", category: "Perseverance" },
      { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Anonymous", category: "Strength" },
      { text: "The key to success is to focus on goals, not obstacles.", author: "Anonymous", category: "Success" },
      { text: "Dream it. Wish it. Do it.", author: "Anonymous", category: "Dreams" },
      { text: "Success doesn't just find you. You have to go out and get it.", author: "Anonymous", category: "Success" },
      { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous", category: "Achievement" },
      { text: "Dream bigger. Do bigger.", author: "Anonymous", category: "Dreams" },
      { text: "Don't stop until you're proud.", author: "Anonymous", category: "Achievement" },
      { text: "Make it happen.", author: "Anonymous", category: "Action" },
      { text: "Stay focused and never give up.", author: "Anonymous", category: "Focus" },
      { text: "Believe in your inner power.", author: "Anonymous", category: "Belief" },
      { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "Wisdom" },
      { text: "Life begins at the end of your comfort zone.", author: "Neale Donald Walsch", category: "Growth" },
      { text: "What we achieve inwardly will change outer reality.", author: "Plutarch", category: "Inner Strength" },
      { text: "Be fearless in the pursuit of what sets your soul on fire.", author: "Anonymous", category: "Passion" },
      { text: "The expert in anything was once a beginner.", author: "Anonymous", category: "Learning" },
      { text: "Progress, not perfection.", author: "Anonymous", category: "Growth" },
      { text: "Every master was once a disaster.", author: "Anonymous", category: "Learning" }
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

  private cleanupOldHistory() {
    const today = new Date().toDateString();
    if (this.lastCleanup !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Keep only today's and yesterday's history
      const toKeep = new Set([today, yesterday.toDateString()]);
      for (const date of this.dailyQuoteHistory.keys()) {
        if (!toKeep.has(date)) {
          this.dailyQuoteHistory.delete(date);
        }
      }
      this.lastCleanup = today;
    }
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    const allQuotes = Array.from(this.quotes.values());
    if (allQuotes.length === 0) return undefined;
    
    this.cleanupOldHistory();
    
    const today = new Date().toDateString();
    const todayShown = this.dailyQuoteHistory.get(today) || new Set<string>();
    
    // Get quotes not shown today
    const availableQuotes = allQuotes.filter(quote => !todayShown.has(quote.id));
    
    let selectedQuote: Quote;
    
    if (availableQuotes.length === 0) {
      // If all quotes have been shown today, reset and start over
      todayShown.clear();
      selectedQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    } else {
      // Select from unshown quotes
      const randomIndex = Math.floor(Math.random() * availableQuotes.length);
      selectedQuote = availableQuotes[randomIndex];
    }
    
    // Mark this quote as shown today
    todayShown.add(selectedQuote.id);
    this.dailyQuoteHistory.set(today, todayShown);
    
    return selectedQuote;
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const quote: Quote = { ...insertQuote, id };
    this.quotes.set(id, quote);
    return quote;
  }
}

export const storage = new MemStorage();
