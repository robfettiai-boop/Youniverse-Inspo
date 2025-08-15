import { useQuery } from "@tanstack/react-query";
import type { Quote } from "@shared/schema";
import QuoteDisplay from "@/components/quote-display";
import PopulationMeter from "@/components/population-meter";
import brandLogo from "@assets/b3eaf067-b59f-496e-9dd8-99bfa0cc88e0_1754836286091.png";
import { Instagram, Music } from "lucide-react";
import { makeLettersColored } from "@/utils/redR";
import html2canvas from "html2canvas";

export default function Home() {
  const { data: quote, isLoading, refetch } = useQuery<Quote>({
    queryKey: ["/api/quotes/random"],
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const handleNewQuote = () => {
    refetch();
  };

  const captureAndShareInstagram = async () => {
    try {
      // Hide share menu temporarily
      const shareMenu = document.querySelector('.share-menu-backdrop') as HTMLElement;
      if (shareMenu) {
        shareMenu.style.display = 'none';
      }

      // Wait a bit for UI to settle
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the entire page
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create download link for the image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'inspiration-of-the-day.png';
          
          // Create temporary container with instructions
          const instructionDiv = document.createElement('div');
          instructionDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #e91e63;
            border-radius: 15px;
            padding: 30px;
            z-index: 1001;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          `;
          
          instructionDiv.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #e91e63; font-size: 18px;">📱 Share to Instagram Story</h3>
            <p style="margin: 0 0 20px 0; color: #666; line-height: 1.5;">
              Image captured! Choose how to share:
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button id="download-btn" style="
                padding: 12px 20px; 
                background: linear-gradient(135deg, #e91e63, #ad1457); 
                color: white; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer;
                font-weight: bold;
              ">📥 Download Image</button>
              <button id="instagram-app-btn" style="
                padding: 12px 20px; 
                background: linear-gradient(135deg, #405de6, #833ab4, #c13584, #e1306c, #fd1d1d); 
                color: white; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer;
                font-weight: bold;
              ">📱 Open Instagram App</button>
              <button id="close-instruction-btn" style="
                padding: 8px 16px; 
                background: transparent; 
                color: #666; 
                border: 1px solid #ddd; 
                border-radius: 6px; 
                cursor: pointer;
              ">Cancel</button>
            </div>
          `;

          const backdrop2 = document.createElement('div');
          backdrop2.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
          `;
          
          backdrop2.appendChild(instructionDiv);
          document.body.appendChild(backdrop2);

          // Event handlers
          document.getElementById('download-btn')!.onclick = () => {
            link.click();
            document.body.removeChild(backdrop2);
            URL.revokeObjectURL(url);
          };

          document.getElementById('instagram-app-btn')!.onclick = () => {
            // Try to open Instagram app
            const instagramUrl = 'instagram://camera';
            window.open(instagramUrl, '_blank');
            
            // Also download the image for manual sharing
            link.click();
            document.body.removeChild(backdrop2);
            URL.revokeObjectURL(url);
          };

          document.getElementById('close-instruction-btn')!.onclick = () => {
            document.body.removeChild(backdrop2);
            URL.revokeObjectURL(url);
          };

          backdrop2.onclick = (e) => {
            if (e.target === backdrop2) {
              document.body.removeChild(backdrop2);
              URL.revokeObjectURL(url);
            }
          };
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('Failed to capture image. Please try again.');
    }
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
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    `;
    
    const backdrop = document.createElement('div');
    backdrop.className = 'share-menu-backdrop';
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
    twitterBtn.textContent = '🐦 Share on Twitter';
    twitterBtn.style.cssText = 'padding: 12px; border: 1px solid #1da1f2; background: white; cursor: pointer; border-radius: 6px; color: #1da1f2; font-weight: 500;';
    twitterBtn.onclick = () => {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`, '_blank');
      document.body.removeChild(backdrop);
    };
    
    const instagramBtn = document.createElement('button');
    instagramBtn.textContent = '📸 Share on Instagram Story';
    instagramBtn.style.cssText = 'padding: 12px; border: 1px solid #e91e63; background: white; cursor: pointer; border-radius: 6px; color: #e91e63; font-weight: 500;';
    instagramBtn.onclick = async () => {
      document.body.removeChild(backdrop);
      await captureAndShareInstagram();
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Cancel';
    closeBtn.style.cssText = 'padding: 10px; border: 1px solid gray; background: white; cursor: pointer; border-radius: 6px; color: #666;';
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
          href="https://www.instagram.com/robfettuccino?igsh=NGgxaTFmc3ZweWVp" 
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

        {/* Population Meter - centered with extra bottom spacing */}
        <div className="flex justify-center mb-16">
          <PopulationMeter />
        </div>

        {/* Slogan - centered */}
        <div className="flex justify-center">
          <p className="text-lg text-gray-600 font-medium tracking-wide">
            Take nothing for granted..
          </p>
        </div>
      </div>
    </div>
  );
}
