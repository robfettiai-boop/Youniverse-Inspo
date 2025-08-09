import { useQuery } from "@tanstack/react-query";
import type { Quote } from "@shared/schema";
import QuoteDisplay from "@/components/quote-display";

export default function Home() {
  const { data: quote, isLoading, refetch } = useQuery<Quote>({
    queryKey: ["/api/quotes/random"],
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const handleNewQuote = () => {
    refetch();
  };

  const handleShare = () => {
    if (!quote) return;

    const shareText = `"${quote.text}" — ${quote.author}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Inspiration of the Day',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        // Could add toast notification here
        alert('Quote copied to clipboard!');
      });
    }
  };

  return (
    <div className="font-vogue bg-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <QuoteDisplay 
          quote={quote} 
          isLoading={isLoading}
          onNewQuote={handleNewQuote}
          onShare={handleShare}
        />
      </div>
    </div>
  );
}
