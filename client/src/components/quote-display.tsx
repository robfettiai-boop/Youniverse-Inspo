import type { Quote } from "@shared/schema";

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
        <>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-black leading-relaxed mb-8">
            {quote.text}
          </blockquote>
          
          <footer className="text-lg md:text-xl text-gray-600 mb-12">
            — {quote.author}
          </footer>
        </>
      ) : (
        <div className="text-xl text-gray-600">
          Failed to load quote. Please try again.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          className="px-6 py-3 text-black border border-black hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNewQuote}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'New Quote'}
        </button>
        
        <button 
          className="px-6 py-3 text-gray-600 border border-gray-300 hover:border-black hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onShare}
          disabled={!quote}
        >
          Share
        </button>
      </div>
    </div>
  );
}
