import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Star, ArrowRight } from "lucide-react";

const Events = () => {
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

  const upcomingEvents = [
    {
      title: "E-Summit 2024",
      date: "March 15-17, 2024",
      location: "IIT Kanpur Campus",
      attendees: "2000+",
      type: "Flagship Event",
      description: "Our annual flagship event bringing together entrepreneurs, investors, and innovators.",
      featured: true
    },
    {
      title: "Startup Masterclass",
      date: "February 20, 2024",
      location: "Virtual & On-campus",
      attendees: "500+",
      type: "Workshop",
      description: "Learn from successful entrepreneurs about building and scaling startups."
    },
    {
      title: "TEDx IIT Kanpur",
      date: "April 8, 2024",
      location: "Auditorium, IIT Kanpur",
      attendees: "800+",
      type: "Talk Series",
      description: "Ideas worth spreading - inspiring talks from thought leaders and innovators."
    }
  ];

  const pastEvents = [
    {
      title: "UpStart Competition",
      participants: "150+ Startups",
      highlight: "₹10L+ Prize Pool"
    },
    {
      title: "Campus Hangouts",
      participants: "Multiple Sessions",
      highlight: "Expert Interactions"
    },
    {
      title: "Startup Internship Fair",
      participants: "300+ Students",
      highlight: "73% Placement Rate"
    }
  ];

  return (
    <section id="events" ref={sectionRef} className="py-20 bg-card relative overflow-hidden">
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
            Our <span className="text-primary">Events</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Join us for exciting events that bring together the entrepreneurial community. From workshops 
            to competitions, we create opportunities for learning, networking, and growth.
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h3 className={`text-3xl font-bold text-foreground mb-8 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Upcoming Events
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl bg-background/80 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/5 group ${
                  event.featured ? 'ring-2 ring-primary/20' : ''
                } ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${600 + index * 150}ms` }}
              >
                {event.featured && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Featured
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {event.type}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h4>

                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    {event.attendees} Expected
                  </div>
                </div>

                <Button 
                  variant={event.featured ? "hero-primary" : "outline"}
                  className="w-full group-hover:scale-105 transition-transform"
                >
                  Register Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events Stats */}
        <div className={`transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Past Event Highlights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {event.title}
                </h4>
                <p className="text-muted-foreground text-sm mb-2">
                  {event.participants}
                </p>
                <p className="text-primary font-semibold">
                  {event.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Stay Updated with Our Events
            </h3>
            <p className="text-muted-foreground mb-6">
              Get notified about upcoming events, workshops, and opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-primary/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button variant="hero-primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;