import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Award, Trophy, Handshake } from "lucide-react";

const Sponsors = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const sponsorTiers = [
    {
      tier: "Title Sponsors",
      icon: <Trophy className="w-8 h-8" />,
      sponsors: [
        { name: "TechCorp", logo: "TC" },
        { name: "InnovateLabs", logo: "IL" },
      ]
    },
    {
      tier: "Gold Partners",
      icon: <Award className="w-8 h-8" />,
      sponsors: [
        { name: "StartupHub", logo: "SH" },
        { name: "VentureCapital", logo: "VC" },
        { name: "TechFoundry", logo: "TF" },
      ]
    },
    {
      tier: "Silver Partners",
      icon: <Star className="w-8 h-8" />,
      sponsors: [
        { name: "CloudSystems", logo: "CS" },
        { name: "DataTech", logo: "DT" },
        { name: "AI Solutions", logo: "AS" },
        { name: "BlockChain Co", logo: "BC" },
      ]
    }
  ];

  const partnershipBenefits = [
    {
      title: "Brand Visibility",
      description: "Showcase your brand to 2000+ attendees and online audience",
      icon: "🎯"
    },
    {
      title: "Talent Access",
      description: "Connect with bright minds from IIT Kanpur and beyond",
      icon: "🧠"
    },
    {
      title: "Innovation Partnership",
      description: "Collaborate on cutting-edge projects and startups",
      icon: "🚀"
    },
    {
      title: "Networking Opportunities",
      description: "Build meaningful connections in the startup ecosystem",
      icon: "🤝"
    }
  ];

  return (
    <section id="sponsors" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-40 left-10 w-32 h-32 rounded-full bg-primary/20"></div>
        <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full bg-primary/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl font-bold text-foreground mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Our <span className="text-primary">Partners</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            We collaborate with industry leaders and organizations who believe in fostering 
            entrepreneurship and innovation among the next generation.
          </p>
        </div>

        {/* Sponsor Tiers */}
        <div className="space-y-12 mb-20">
          {sponsorTiers.map((tier, tierIndex) => (
            <div
              key={tierIndex}
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + tierIndex * 200}ms` }}
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-primary mr-3">
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {tier.tier}
                  </h3>
                </div>
              </div>

              <div className={`grid grid-cols-2 md:grid-cols-${tier.sponsors.length > 3 ? '4' : tier.sponsors.length} gap-6 max-w-4xl mx-auto`}>
                {tier.sponsors.map((sponsor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-6 rounded-2xl bg-card/80 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-3 group-hover:bg-primary/20 transition-colors">
                        {sponsor.logo}
                      </div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {sponsor.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Benefits */}
        <div className={`mb-16 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">
            Why Partner With Us?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnershipBenefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-card/80 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 group"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsorship CTA */}
        <div className={`text-center transition-all duration-1000 delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 max-w-2xl mx-auto">
            <div className="text-primary mb-4">
              <Handshake className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Become Our Partner
            </h3>
            <p className="text-muted-foreground mb-6">
              Join us in nurturing the next generation of entrepreneurs and innovators. 
              Let's create impact together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero-primary" size="lg">
                Partnership Proposal
              </Button>
              <Button variant="outline" size="lg">
                Download Brochure
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-1400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <blockquote className="text-lg italic text-muted-foreground max-w-2xl mx-auto">
            "Partnering with E-Cell IIT Kanpur has been an incredible journey. The energy, 
            innovation, and talent we've encountered here is truly remarkable."
          </blockquote>
          <p className="text-primary font-semibold mt-4">- Partner Testimonial</p>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;