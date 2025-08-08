import { Button } from "@/components/ui/button";
import { ChevronDown, Rocket, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  const scrollToExplore = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen hero-gradient-bg flex items-center justify-center overflow-hidden">
      {/* Animated Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 animate-float">
          <Rocket className="w-8 h-8 text-primary/30" />
        </div>
        <div className="absolute top-40 right-32 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-6 h-6 text-primary/40" />
        </div>
        <div className="absolute bottom-40 left-16 animate-float" style={{ animationDelay: '4s' }}>
          <Zap className="w-10 h-10 text-primary/20" />
        </div>
        <div className="absolute top-60 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-4 h-4 text-primary/50" />
        </div>
        <div className="absolute bottom-20 right-40 animate-float" style={{ animationDelay: '3s' }}>
          <Rocket className="w-6 h-6 text-primary/35" />
        </div>
      </div>

      {/* Central Glass Morphism Circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 md:w-[600px] md:h-[600px] rounded-full glass-morphism opacity-40"></div>
      </div>


      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in">
        {/* Top Badge */}
        <div className="inline-flex items-center px-6 py-3 rounded-full glass-morphism mb-8 animate-slide-up">
          <span className="text-sm font-medium text-primary">
            Entrepreneur Cell
          </span>
        </div>

        {/* Main Heading */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-2">
            <span className="rainbow-text">Innovation</span>
          </h1>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-hero-text-primary">
            Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-hero-text-secondary mt-6 font-medium animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Igniting Ideas, Empowering Entrepreneurs, Shaping Futures.
          </p>
        </div>


        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Button variant="hero-primary" size="lg" className="px-8 py-4 text-lg">
            Join Our Community
          </Button>
          <Button 
            variant="hero-secondary" 
            size="lg" 
            className="px-8 py-4 text-lg"
            onClick={() => {
              const eventsSection = document.getElementById('upcoming-events');
              if (eventsSection) {
                eventsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore Events
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="animate-slide-up cursor-pointer group" 
          style={{ animationDelay: '0.8s' }}
          onClick={scrollToExplore}
        >
          <p className="text-hero-text-secondary text-sm mb-2 group-hover:text-primary transition-colors">
            Scroll to explore
          </p>
          <ChevronDown className="w-6 h-6 text-hero-text-secondary mx-auto animate-bounce group-hover:text-primary transition-colors" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;