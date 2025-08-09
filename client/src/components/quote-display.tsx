import type { Quote } from "@shared/schema";
import { makeLettersColored } from "../utils/redR";

interface QuoteDisplayProps {
  quote?: Quote;
  isLoading: boolean;
  onNewQuote: () => void;
  onShare: () => void;
}

export default function QuoteDisplay({ quote, isLoading, onNewQuote, onShare }: QuoteDisplayProps) {
  return (
    <div className="text-center">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 max-w-lg mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded mb-4 max-w-md mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      ) : quote ? (
        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-black leading-relaxed mb-12">
          {makeLettersColored(quote.text)}
        </blockquote>
      ) : (
        <div className="text-xl text-gray-600">
          Failed to load quote. Please try again.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          className="group relative px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          onClick={onNewQuote}
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative text-2xl">
            {isLoading ? '⟲' : '∞'}
          </span>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
        </button>
        
        <button 
          className="px-6 py-3 text-gray-600 border border-gray-300 hover:border-black hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onShare}
          disabled={!quote}
        >
          {makeLettersColored("Share")}
        </button>
      </div>
    </div>
  );
}
