import { useEffect, useRef, useState } from "react";
import { Target, Users, Lightbulb, TrendingUp } from "lucide-react";

const About = () => {
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

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission Driven",
      description: "To provide a dynamic platform through events, mentorship, and resources that encourages creativity, collaboration, and the creation of sustainable ventures."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community First",
      description: "Building a vibrant network of entrepreneurs and innovators"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation Hub",
      description: "Transforming ideas into successful startups through mentorship"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Focused",
      description: "Connecting startups with investors and funding opportunities"
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-4 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/20"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-primary/10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl font-bold text-foreground mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            About <span className="text-primary">E-Cell SMEC</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            The Entrepreneurship Cell of St. Martin's Engineering College is committed to fostering innovation and an entrepreneurial mindset among students. Through events, workshops, mentorship, and collaboration, we encourage students to transform ideas into impactful startups and contribute to a vibrant culture of innovation on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-2xl bg-background/50 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="text-primary mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;