import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global function to make specific letters colored (R=red, G=forest green, O=orange)
function applyColoredLettersGlobally() {
  const processTextNodes = () => {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      if (textNode.textContent && /[RrGgOo]/.test(textNode.textContent)) {
        textNodes.push(textNode);
      }
    }
    
    textNodes.forEach(textNode => {
      if (textNode.parentElement && !textNode.parentElement.classList.contains('colored-letters-processed')) {
        const text = textNode.textContent || '';
        if (/[RrGgOo]/.test(text)) {
          const parts = text.split(/([RrGgOo])/);
          const fragment = document.createDocumentFragment();
          
          parts.forEach(part => {
            if (part === 'R' || part === 'r') {
              const span = document.createElement('span');
              span.className = 'red-r';
              span.textContent = part;
              fragment.appendChild(span);
            } else if (part === 'G' || part === 'g') {
              const span = document.createElement('span');
              span.className = 'green-g';
              span.textContent = part;
              fragment.appendChild(span);
            } else if (part === 'O' || part === 'o') {
              const span = document.createElement('span');
              span.className = 'orange-o';
              span.textContent = part;
              fragment.appendChild(span);
            } else if (part) {
              fragment.appendChild(document.createTextNode(part));
            }
          });
          
          if (textNode.parentElement) {
            textNode.parentElement.classList.add('colored-letters-processed');
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

// Apply colored letters effect after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyColoredLettersGlobally);
} else {
  applyColoredLettersGlobally();
}

createRoot(document.getElementById("root")!).render(<App />);
