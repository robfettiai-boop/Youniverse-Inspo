import { RefreshCw, Share2 } from "lucide-react";
import type { Quote } from "@shared/schema";

interface QuoteDisplayProps {
  quote?: Quote;
  isLoading: boolean;
  onNewQuote: () => void;
  onShare: () => void;
}

export default function QuoteDisplay({ quote, isLoading, onNewQuote, onShare }: QuoteDisplayProps) {
  return (
    <>
      {/* Quote Card */}
      <div className="quote-card rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
        <div className="mb-6">
          <span className="text-6xl text-brand-purple opacity-30 font-serif">"</span>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ) : quote ? (
          <>
            {/* Main Quote */}
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-text-primary leading-relaxed mb-8 transition-opacity duration-300">
              {quote.text}
            </blockquote>
            
            {/* Author Attribution */}
            <footer className="text-lg md:text-xl text-text-muted font-medium transition-opacity duration-300">
              — {quote.author}
            </footer>
          </>
        ) : (
          <div className="text-xl text-text-muted">
            Failed to load quote. Please try again.
          </div>
        )}
        
        <div className="mt-6">
          <span className="text-6xl text-brand-purple opacity-30 font-serif rotate-180 inline-block">"</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Refresh Button */}
        <button 
          className="group flex items-center space-x-2 bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNewQuote}
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-300 ${isLoading ? 'animate-spin' : ''}`} />
          <span>New Quote</span>
        </button>
        
        {/* Share Button */}
        <button 
          className="group flex items-center space-x-2 bg-white text-text-primary px-8 py-4 rounded-full font-medium border border-gray-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onShare}
          disabled={!quote}
        >
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span>Share</span>
        </button>
      </div>
    </>
  );
}
