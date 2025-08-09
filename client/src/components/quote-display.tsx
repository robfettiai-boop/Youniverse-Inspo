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

      <div className="flex flex-row gap-8 justify-center items-center">
        <button 
          className="group text-black text-5xl font-medium leading-none transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center"
          onClick={onNewQuote}
          disabled={isLoading}
          style={{ fontWeight: '500', transform: 'translateY(4px)' }}
        >
          <span className="leading-none flex items-center justify-center font-medium" style={{ fontWeight: '500' }}>
            {isLoading ? '⟲' : '∞'}
          </span>
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
