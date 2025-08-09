export default function Header() {
  return (
    <header className="relative z-10 py-6 px-4">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-lg">✨</span>
          </div>
          <span className="text-xl font-semibold text-text-primary">Inspiration of the Day</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-text-muted hover:text-text-primary transition-colors duration-200">About</a>
          <a href="#" className="text-text-muted hover:text-text-primary transition-colors duration-200">Archive</a>
          <a href="#" className="text-text-muted hover:text-text-primary transition-colors duration-200">Contact</a>
        </div>
      </nav>
    </header>
  );
}
