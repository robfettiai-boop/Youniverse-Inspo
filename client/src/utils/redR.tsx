// Utility to make specific letters colored
export function makeLettersColored(text: string): React.ReactNode {
  if (!text) return text;
  
  const parts = text.split(/(R|r|B|b|Y|y)/);
  
  return parts.map((part, index) => {
    if (part === 'R' || part === 'r') {
      return <span key={index} className="wine-red-r">{part}</span>;
    }
    if (part === 'B' || part === 'b') {
      return <span key={index} className="lapis-blue-b">{part}</span>;
    }
    if (part === 'Y' || part === 'y') {
      return <span key={index} className="gold-y">{part}</span>;
    }
    return part;
  });
}

// Legacy function for backward compatibility
export function makeRsRed(text: string): React.ReactNode {
  return makeLettersColored(text);
}