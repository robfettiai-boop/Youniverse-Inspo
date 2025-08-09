// Utility to make specific letters colored
export function makeLettersColored(text: string): React.ReactNode {
  if (!text) return text;
  
  const parts = text.split(/(R|r|G|g|O|o)/);
  
  return parts.map((part, index) => {
    if (part === 'R' || part === 'r') {
      return <span key={index} className="red-r">{part}</span>;
    }
    if (part === 'G' || part === 'g') {
      return <span key={index} className="green-g">{part}</span>;
    }
    if (part === 'O' || part === 'o') {
      return <span key={index} className="orange-o">{part}</span>;
    }
    return part;
  });
}

// Legacy function for backward compatibility
export function makeRsRed(text: string): React.ReactNode {
  return makeLettersColored(text);
}