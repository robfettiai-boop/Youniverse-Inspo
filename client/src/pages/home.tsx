import { useQuery } from "@tanstack/react-query";
import type { Quote } from "@shared/schema";
import Header from "@/components/header";
import QuoteDisplay from "@/components/quote-display";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";

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
        title: 'Daily Inspiration',
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
    <div className="font-inter bg-white min-h-screen">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 gradient-bg rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-blue-400 rounded-full opacity-10 animate-float-delayed-2"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-purple-400 rounded-full opacity-10 animate-float-delayed-4"></div>
      </div>

      <Header />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <QuoteDisplay 
            quote={quote} 
            isLoading={isLoading}
            onNewQuote={handleNewQuote}
            onShare={handleShare}
          />

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-purple">20+</div>
              <div className="text-text-muted font-medium">Curated Quotes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-purple">∞</div>
              <div className="text-text-muted font-medium">Daily Inspiration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-purple">✨</div>
              <div className="text-text-muted font-medium">Fresh Motivation</div>
            </div>
          </div>
        </div>
      </main>

      <FeaturesSection />
      <Footer />
    </div>
  );
}
