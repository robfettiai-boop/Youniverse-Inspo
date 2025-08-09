import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global function to make all R letters red
function applyRedRGlobally() {
  const processTextNodes = () => {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      if (textNode.textContent && /[Rr]/.test(textNode.textContent)) {
        textNodes.push(textNode);
      }
    }
    
    textNodes.forEach(textNode => {
      if (textNode.parentElement && !textNode.parentElement.classList.contains('red-r-processed')) {
        const text = textNode.textContent || '';
        if (/[Rr]/.test(text)) {
          const parts = text.split(/([Rr])/);
          const fragment = document.createDocumentFragment();
          
          parts.forEach(part => {
            if (part === 'R' || part === 'r') {
              const span = document.createElement('span');
              span.className = 'red-r';
              span.textContent = part;
              fragment.appendChild(span);
            } else if (part) {
              fragment.appendChild(document.createTextNode(part));
            }
          });
          
          if (textNode.parentElement) {
            textNode.parentElement.classList.add('red-r-processed');
          }
          if (textNode.parentNode) {
            textNode.parentNode.replaceChild(fragment, textNode);
          }
        }
      }
    });
  };

  const observer = new MutationObserver(processTextNodes);
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true, 
    characterData: true 
  });
  
  // Initial run
  processTextNodes();
}

// Apply red R effect after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyRedRGlobally);
} else {
  applyRedRGlobally();
}

createRoot(document.getElementById("root")!).render(<App />);
