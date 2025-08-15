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

      // Temporarily remove R coloring from all R letters in the quote
      const originalRElements: { element: HTMLElement; originalColor: string }[] = [];
      const rElements = document.querySelectorAll('.wine-red-r');
      rElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        originalRElements.push({ 
          element: htmlEl, 
          originalColor: htmlEl.style.color || window.getComputedStyle(htmlEl).color 
        });
        htmlEl.style.color = '#E4A853'; // Use citrine orange instead
      });

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

      // Restore original R coloring
      originalRElements.forEach(({ element, originalColor }) => {
        element.style.color = originalColor;
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
            border: 2px solid #E4A853;
            border-radius: 15px;
            padding: 30px;
            z-index: 1001;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(228, 168, 83, 0.3);
          `;
          
          instructionDiv.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #E4A853; font-size: 18px;">📱 Ready for Instagram Stories!</h3>
            <p style="margin: 0 0 20px 0; color: #E4A853; line-height: 1.5;">
              Screenshot captured! The Instagram Stories button will automatically open Instagram and save the image to your device.
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button id="download-btn" style="
                padding: 12px 20px; 
                background: #E4A853; 
                color: white; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
              ">📥 Download Image</button>
              <button id="instagram-app-btn" style="
                padding: 12px 20px; 
                background: #E1306C; 
                color: white; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
              ">📸 Share to Instagram Stories</button>
              <button id="close-instruction-btn" style="
                padding: 8px 16px; 
                background: transparent; 
                color: #E4A853; 
                border: 1px solid #E4A853; 
                border-radius: 6px; 
                cursor: pointer;
                transition: all 0.2s ease;
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
            // Detect if user is on mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
              // For mobile devices, try to open Instagram Stories directly
              const instagramStoriesUrl = 'instagram-stories://share';
              
              // First download/save the image
              link.click();
              
              // Then try to open Instagram Stories after a brief delay
              setTimeout(() => {
                try {
                  // Try Instagram Stories deep link first
                  window.location.href = instagramStoriesUrl;
                  
                  // Fallback to Instagram camera if Stories link doesn't work
                  setTimeout(() => {
                    if (document.hidden === false) { // If still on our page, try camera
                      window.location.href = 'instagram://camera';
                    }
                  }, 1500);
                  
                  // Final fallback to Instagram main app
                  setTimeout(() => {
                    if (document.hidden === false) { // If still on our page
                      window.location.href = 'instagram://';
                    }
                  }, 3000);
                  
                } catch (error) {
                  // If all deep links fail, open Instagram web
                  window.open('https://www.instagram.com/', '_blank');
                }
              }, 1000);
              
            } else {
              // For desktop, download image and open Instagram web
              link.click();
              window.open('https://www.instagram.com/', '_blank');
            }
            
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

  const captureAndDirectShareInstagram = async () => {
    try {
      // Temporarily change R letters to orange for Instagram screenshot
      const rElements = document.querySelectorAll('span[style*="color: rgb(224, 17, 95)"]');
      const originalRElements: Array<{ element: HTMLElement, originalColor: string }> = [];
      
      rElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        originalRElements.push({
          element: htmlElement,
          originalColor: htmlElement.style.color
        });
        htmlElement.style.color = '#E4A853'; // Orange for Instagram
      });

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#ffffff',
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Restore original R coloring
      originalRElements.forEach(({ element, originalColor }) => {
        element.style.color = originalColor;
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          // Create download link
          const link = document.createElement('a');
          link.href = url;
          link.download = `inspiration-quote-${Date.now()}.png`;
          link.click();

          // Then immediately try to open Instagram
          if (isMobile) {
            // For mobile, try Instagram Stories deep links
            setTimeout(() => {
              try {
                window.location.href = 'instagram-stories://share';
                
                setTimeout(() => {
                  if (document.hidden === false) {
                    window.location.href = 'instagram://camera';
                  }
                }, 1500);
                
                setTimeout(() => {
                  if (document.hidden === false) {
                    window.location.href = 'instagram://';
                  }
                }, 3000);
                
              } catch (error) {
                window.open('https://www.instagram.com/', '_blank');
              }
            }, 500);
          } else {
            // For desktop, open Instagram web
            setTimeout(() => {
              window.open('https://www.instagram.com/', '_blank');
            }, 500);
          }
          
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Failed to capture and share to Instagram:', error);
      alert('Failed to share to Instagram. Please try again.');
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
      border: 1px solid #E4A853;
      padding: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 15px;
      min-width: 250px;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(228, 168, 83, 0.3);
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
    
    const instagramBtn = document.createElement('button');
    instagramBtn.textContent = 'Share on Instagram';
    instagramBtn.style.cssText = `
      padding: 15px; 
      border: 1px solid #E4A853; 
      background: white; 
      cursor: pointer; 
      border-radius: 6px; 
      color: #E4A853; 
      font-weight: 500;
      transition: all 0.2s ease;
    `;
    instagramBtn.onmouseenter = () => {
      instagramBtn.style.backgroundColor = '#E4A853';
      instagramBtn.style.color = 'white';
    };
    instagramBtn.onmouseleave = () => {
      instagramBtn.style.backgroundColor = 'white';
      instagramBtn.style.color = '#E4A853';
    };
    instagramBtn.onclick = async () => {
      document.body.removeChild(backdrop);
      await captureAndDirectShareInstagram();
    };
    
    const twitterBtn = document.createElement('button');
    twitterBtn.textContent = 'Share on X';
    twitterBtn.style.cssText = `
      padding: 15px; 
      border: 1px solid #E4A853; 
      background: white; 
      cursor: pointer; 
      border-radius: 6px; 
      color: #E4A853; 
      font-weight: 500;
      transition: all 0.2s ease;
    `;
    twitterBtn.onmouseenter = () => {
      twitterBtn.style.backgroundColor = '#E4A853';
      twitterBtn.style.color = 'white';
    };
    twitterBtn.onmouseleave = () => {
      twitterBtn.style.backgroundColor = 'white';
      twitterBtn.style.color = '#E4A853';
    };
    twitterBtn.onclick = () => {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`, '_blank');
      document.body.removeChild(backdrop);
    };
    
    backdrop.onclick = () => document.body.removeChild(backdrop);
    
    shareMenu.appendChild(instagramBtn);
    shareMenu.appendChild(twitterBtn);
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
          className="hover:text-pink-500 transition-colors duration-300"
          style={{ color: '#132448' }}
        >
          <Instagram size={24} />
        </a>
        <a 
          href="https://open.spotify.com/playlist/7FrD5azbIj9oWZwZRAjlGc?si=RapRMiqiTCGqbJHC_sHBCw&pi=MNF2FYS6QeqYl" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-green-500 transition-colors duration-300"
          style={{ color: '#132448' }}
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
        <div className="flex justify-center w-full">
          <p className="text-lg font-medium tracking-wide text-center" style={{ color: '#9966CC' }}>
            Take nothing for granted
          </p>
        </div>
      </div>
    </div>
  );
}
