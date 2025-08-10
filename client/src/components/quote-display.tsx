import type { Quote } from "@shared/schema";
import { makeLettersColored } from "../utils/redR";
import infinityImage from "@assets/360_F_544044746_Swth0lqH9CcTci8S5p2FS4Jqpcy6HWoI_1754832179982.jpg";

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
          className="group transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center px-6 py-3 h-12"
          onClick={onNewQuote}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="text-purple-900 text-2xl">⟲</span>
          ) : (
            <img 
              src={infinityImage} 
              alt="Infinity symbol" 
              className="w-8 h-8 object-contain"
            />
          )}
        </button>
        
        <button 
          className="px-6 py-3 text-gray-600 border border-gray-300 hover:border-black hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12 flex items-center"
          onClick={onShare}
          disabled={!quote}
        >
          {makeLettersColored("Share")}
        </button>
      </div>
    </div>
  );
}
