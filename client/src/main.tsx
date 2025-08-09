import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple approach - let React handle the colored letters
function applyColoredLettersToNonReact() {
  // Only apply to elements outside React components (like modals)
  setTimeout(() => {
    const elements = document.querySelectorAll('div[style*="position: fixed"]:not([data-colored])');
    elements.forEach(element => {
      if (element.textContent && /[RrBbYy]/.test(element.textContent)) {
        element.setAttribute('data-colored', 'true');
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const textNodes: Text[] = [];
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent && /[RrBbYy]/.test(node.textContent)) {
            textNodes.push(node as Text);
          }
        }
        
        textNodes.forEach(textNode => {
          const text = textNode.textContent || '';
          if (/[RrBbYy]/.test(text)) {
            const parts = text.split(/([RrBbYy])/);
            const fragment = document.createDocumentFragment();
            
            parts.forEach(part => {
              if (part === 'R' || part === 'r') {
                const span = document.createElement('span');
                span.className = 'wine-red-r';
                span.textContent = part;
                fragment.appendChild(span);
              } else if (part === 'B' || part === 'b') {
                const span = document.createElement('span');
                span.className = 'lapis-blue-b';
                span.textContent = part;
                fragment.appendChild(span);
              } else if (part === 'Y' || part === 'y') {
                const span = document.createElement('span');
                span.className = 'gold-y';
                span.textContent = part;
                fragment.appendChild(span);
              } else if (part) {
                fragment.appendChild(document.createTextNode(part));
              }
            });
            
            if (textNode.parentNode) {
              textNode.parentNode.replaceChild(fragment, textNode);
            }
          }
        });
      }
    });
  }, 100);
}

// Apply to modals and other non-React elements
document.addEventListener('click', applyColoredLettersToNonReact);

createRoot(document.getElementById("root")!).render(<App />);
