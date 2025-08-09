import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple approach - let React handle the colored letters
function applyColoredLettersToNonReact() {
  // Only apply to elements outside React components (like modals)
  setTimeout(() => {
    const elements = document.querySelectorAll('div[style*="position: fixed"]:not([data-colored])');
    elements.forEach(element => {
      if (element.textContent && /[RrGgOoPpBb]/.test(element.textContent)) {
        element.setAttribute('data-colored', 'true');
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const textNodes: Text[] = [];
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent && /[RrGgOoPpBb]/.test(node.textContent)) {
            textNodes.push(node as Text);
          }
        }
        
        textNodes.forEach(textNode => {
          const text = textNode.textContent || '';
          if (/[RrGgOoPpBb]/.test(text)) {
            const parts = text.split(/([RrGgOoPpBb])/);
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
              } else if (part === 'P' || part === 'p') {
                const span = document.createElement('span');
                span.className = 'pink-p';
                span.textContent = part;
                fragment.appendChild(span);
              } else if (part === 'B' || part === 'b') {
                const span = document.createElement('span');
                span.className = 'brown-b';
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
