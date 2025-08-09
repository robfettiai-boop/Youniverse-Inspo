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

    const shareText = encodeURIComponent(`"${quote.text}"`);
    const currentUrl = encodeURIComponent(window.location.href);
    
    // Create share menu
    const shareMenu = document.createElement('div');
    shareMenu.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid black;
      padding: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 200px;
    `;
    
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    `;
    
    const twitterBtn = document.createElement('button');
    twitterBtn.textContent = 'Share on Twitter';
    twitterBtn.style.cssText = 'padding: 10px; border: 1px solid black; background: white; cursor: pointer;';
    twitterBtn.onclick = () => {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`, '_blank');
      document.body.removeChild(backdrop);
    };
    
    const instagramBtn = document.createElement('button');
    instagramBtn.textContent = 'Share on Instagram';
    instagramBtn.style.cssText = 'padding: 10px; border: 1px solid black; background: white; cursor: pointer;';
    instagramBtn.onclick = () => {
      // Instagram doesn't have direct URL sharing, so copy to clipboard for story/post
      navigator.clipboard.writeText(`"${quote.text}"`).then(() => {
        alert('Quote copied to clipboard! You can now paste it in your Instagram story or post.');
        document.body.removeChild(backdrop);
      });
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = 'padding: 10px; border: 1px solid gray; background: white; cursor: pointer;';
    closeBtn.onclick = () => document.body.removeChild(backdrop);
    
    backdrop.onclick = () => document.body.removeChild(backdrop);
    
    shareMenu.appendChild(twitterBtn);
    shareMenu.appendChild(instagramBtn);
    shareMenu.appendChild(closeBtn);
    backdrop.appendChild(shareMenu);
    document.body.appendChild(backdrop);
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
