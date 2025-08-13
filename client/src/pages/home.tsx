import { useQuery } from "@tanstack/react-query";
import type { Quote } from "@shared/schema";
import QuoteDisplay from "@/components/quote-display";
import PopulationMeter from "@/components/population-meter";
import brandLogo from "@assets/b3eaf067-b59f-496e-9dd8-99bfa0cc88e0_1754836286091.png";
import { Instagram, Music } from "lucide-react";
import { makeLettersColored } from "@/utils/redR";

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
    <div className="font-vogue bg-white min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Social Icons - stay in top right corner */}
      <div className="absolute top-4 right-4 flex gap-4">
        <a 
          href="https://www.instagram.com/learnyourself.jp/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-pink-500 transition-colors duration-300"
        >
          <Instagram size={24} />
        </a>
        <a 
          href="https://open.spotify.com/playlist/7FrD5azbIj9oWZwZRAjlGc?si=RapRMiqiTCGqbJHC_sHBCw&pi=MNF2FYS6QeqYl" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-green-500 transition-colors duration-300"
        >
          <Music size={24} />
        </a>
      </div>

      {/* Main centered content column */}
      <div className="flex flex-col items-center justify-center space-y-16 max-w-4xl w-full">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <img 
            src={brandLogo} 
            alt="LearnYourself.jp" 
            className="h-32 w-auto opacity-95 hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        {/* Quote Display - centered */}
        <div className="text-center w-full">
          <QuoteDisplay 
            quote={quote} 
            isLoading={isLoading}
            onNewQuote={handleNewQuote}
            onShare={handleShare}
          />
        </div>

        {/* Population Meter - centered */}
        <div className="flex justify-center">
          <PopulationMeter />
        </div>

        {/* Slogan - centered */}
        <div className="flex justify-center">
          <p className="text-lg text-gray-600 font-medium tracking-wide">
            {makeLettersColored("Change begins NOW..")}
          </p>
        </div>
      </div>
    </div>
  );
}
