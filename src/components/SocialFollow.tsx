import { useEffect, useRef, useState } from "react";
import { Instagram, Linkedin } from "lucide-react";

const SocialFollow = () => {
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

  const socialLinks = [
    { 
      icon: <Instagram className="w-8 h-8" />, 
      href: "https://www.instagram.com/ecell.smec/", 
      label: "Instagram",
      color: "hover:text-pink-500"
    },
    { 
      icon: <Linkedin className="w-8 h-8" />, 
      href: "https://www.linkedin.com/in/e-cell-smec-336443378?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", 
      label: "LinkedIn",
      color: "hover:text-blue-500"
    },
  ];

  return (
    <section id="follow-us" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/20"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-primary/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl font-bold text-foreground mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Follow <span className="text-primary">Us</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Stay connected with us on social media for the latest updates, events, and entrepreneurial insights.
          </p>
        </div>

        <div className="flex justify-center space-x-8">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={`group p-8 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${social.color}`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="text-primary group-hover:scale-110 transition-transform">
                {social.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {social.label}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFollow;