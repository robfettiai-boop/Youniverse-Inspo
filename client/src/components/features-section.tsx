import { Lightbulb, Book, Smartphone } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="relative z-10 py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Why Inspiration of the Day?</h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">Carefully curated quotes to spark creativity, motivation, and positive thinking in your daily life.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Fresh Inspiration</h3>
            <p className="text-text-muted">New motivational quotes every time you visit, keeping your inspiration fresh and engaging.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Book className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Curated Collection</h3>
            <p className="text-text-muted">Hand-picked quotes from renowned thinkers, leaders, and innovators throughout history.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Mobile Optimized</h3>
            <p className="text-text-muted">Beautiful, responsive design that works perfectly on any device, anywhere you need inspiration.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
