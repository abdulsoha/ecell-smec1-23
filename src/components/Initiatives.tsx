import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Award, BookOpen } from "lucide-react";

const Initiatives = () => {
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

  const initiatives = [
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "E-Summit",
      description: "Our annual flagship event fostering entrepreneurial initiatives and activities on campus to nurture India's future technopreneurs.",
      features: ["Keynote Speakers", "Startup Competitions", "Networking Sessions", "Investor Meetups"]
    },
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "TEDx IIT Kanpur",
      description: "An independent initiative organizing versatile annual talk series from eminent speakers in Technology, Entertainment and Design.",
      features: ["Thought Leaders", "Innovation Stories", "Inspiring Talks", "Global Ideas"]
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "UpStart",
      description: "A unique startup competition that goes beyond conventional pitching, providing mentoring and brainstorming sessions.",
      features: ["Mentorship", "Business Development", "Investor Connect", "Incubation Support"]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Startup Internship Program",
      description: "Connecting IIT Kanpur students with startup internships to experience the entrepreneurial ecosystem firsthand.",
      features: ["Industry Exposure", "Skill Development", "Network Building", "Career Growth"]
    }
  ];

  return (
    <section id="initiatives" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
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
            Our <span className="text-primary">Initiatives</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            E-Cell organizes a variety of events throughout the year to promote entrepreneurial activities 
            in and around the campus, creating opportunities for learning, networking, and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {initiatives.map((initiative, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl bg-card/80 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/5 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                {initiative.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {initiative.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {initiative.description}
              </p>

              <div className="space-y-2 mb-6">
                {initiative.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              >
                Learn More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Campus Hangouts Section */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
            <h3 className="text-3xl font-bold text-foreground mb-4">Campus Hangouts</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Special interactive sessions targeting campus students. Informal discussions between 
              campus community and entrepreneurship experts across various domains.
            </p>
            <Button variant="hero-primary">
              Join Next Hangout
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Initiatives;