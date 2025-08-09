// Utility to make all letter R red
export function makeRsRed(text: string): React.ReactNode {
  if (!text) return text;
  
  const parts = text.split(/(R|r)/);
  
  return parts.map((part, index) => {
    if (part === 'R' || part === 'r') {
      return <span key={index} className="red-r">{part}</span>;
    }
    return part;
  });
}