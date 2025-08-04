import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const Team = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggleTeam = (index: number) => {
    setExpandedTeams(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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

  const teamCategories = [
    {
      name: "Leadership",
      members: [
        {
          name: "RAMA KRISNA",
          department: "CSE(AI&ML)",
          role: "CHIEF",
          photo: null // Placeholder for photo
        },
        {
          name: "NIKITHA VARMA",
          department: "CSE(AI&ML)",
          role: "VICE CHIEF",
          photo: null
        },
        {
          name: "KHAJA GHOUSE KHAN",
          department: "CSG",
          role: "STARTUP ADVISOR & STRATEGY",
          photo: null
        }
      ]
    },
    {
      name: "Technical Team",
      members: [
        {
          name: "SOHAIB AKTHAR",
          department: "CSE(AI&ML)",
          role: "LEAD",
          photo: null
        },
        {
          name: "PRANAY",
          department: "CSE",
          role: "CO-LEAD",
          photo: null
        },
        {
          name: "ABDUL SOHAIL",
          department: "CSE",
          role: "TEAM MEMBER",
          photo: null
        },
        {
          name: "KARTHIK",
          department: "AI&DS",
          role: "TEAM MEMBER",
          photo: null
        },
        {
          name: "MOUNISH",
          department: "CSE(AI&ML)",
          role: "TEAM MEMBER",
          photo: null
        },
        {
          name: "AKASH",
          department: "CSE(AI&ML)",
          role: "TEAM MEMBER",
          photo: null
        }
      ]
    },
    {
      name: "Design Team",
      members: [
        {
          name: "PRANAY",
          department: "CSE(AI&ML)",
          role: "LEAD",
          photo: null
        },
        {
          name: "INDRA AKSHITH",
          department: "CSE",
          role: "CO-LEAD",
          photo: null
        },
        {
          name: "VARSHA",
          department: "AI&DS",
          role: "TEAM MEMBER",
          photo: null
        },
        {
          name: "VISHALAKSHI",
          department: "AI&DS",
          role: "TEAM MEMBER",
          photo: null
        },
        {
          name: "DHEEKSHA",
          department: "AI&DS",
          role: "TEAM MEMBER",
          photo: null
        }
      ]
    },
    {
      name: "Social Media",
      members: [
        {
          name: "BALA VARSHITH",
          department: "CSE(AI&ML)",
          role: "LEAD",
          photo: null
        },
        {
          name: "SATHWIK",
          department: "IT",
          role: "CO-LEAD",
          photo: null
        },
        {
          name: "SHIVANI",
          department: "AI&DS",
          role: "REPRESENTATIVE",
          photo: null
        },
        {
          name: "VIJAY MOHAN",
          department: "CSE(AI&ML)",
          role: "EDITOR",
          photo: null
        }
      ]
    },
    {
      name: "Marketing Team",
      members: [
        {
          name: "KAMNA",
          department: "CSE(AI&ML)",
          role: "AD LEAD",
          photo: null
        },
        {
          name: "AKSHITHA",
          department: "CSE(AI&ML)",
          role: "PR LEAD",
          photo: null
        },
        {
          name: "PRERANA",
          department: "AI&DS",
          role: "PR",
          photo: null
        }
      ]
    }
  ];

  return (
    <section id="team" ref={sectionRef} className="py-20 bg-card relative overflow-hidden">
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
            Meet Our <span className="text-primary">Team</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Get to know the passionate individuals driving innovation and entrepreneurship at SMEC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamCategories.map((category, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl bg-background/80 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-foreground mb-4">{category.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTeam(index)}
                  className="w-full flex items-center justify-center"
                >
                  View Team
                  {expandedTeams.includes(index) ? (
                    <ChevronUp className="ml-2 w-4 h-4" />
                  ) : (
                    <ChevronDown className="ml-2 w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className={`overflow-hidden transition-all duration-500 ${
                expandedTeams.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="mt-4 space-y-4 max-h-80 overflow-y-auto">
                  {category.members.map((member, memberIndex) => (
                    <div key={memberIndex} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-primary/5">
                      <div className="w-12 h-12 bg-gray-200 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                        {member.photo ? (
                          <img 
                            src={member.photo} 
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">Photo</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                        <p className="text-xs text-primary">{member.department}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;