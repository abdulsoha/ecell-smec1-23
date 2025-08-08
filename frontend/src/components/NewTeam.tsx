import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";

const NewTeam = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Sort members by hierarchy: CHIEF, VICE CHIEF, LEAD, CO-LEAD, then others
  const sortMembersByHierarchy = (members: any[]) => {
    const hierarchy = ['CHIEF', 'VICE CHIEF', 'STARTUP ADVISOR & STRATEGY', 'LEAD', 'CO-LEAD', 'AD LEAD', 'PR LEAD', 'REPRESENTATIVE', 'EDITOR', 'PR', 'TEAM MEMBER'];
    return [...members].sort((a, b) => {
      const aIndex = hierarchy.indexOf(a.role);
      const bIndex = hierarchy.indexOf(b.role);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
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

  const teamMembers = {
    Leadership: [
      {
        name: "RAMA KRISNA",
        department: "CSE(AI&ML)",
        role: "CHIEF",
        image: "/lovable-uploads/c6e8db06-dedc-46a5-b959-cf93dfda1097.png",
        hasWomen: false
      },
      {
        name: "NIKITHA VARMA",
        department: "CSE(AI&ML)",
        role: "VICE CHIEF",
        image: "/lovable-uploads/4146a18d-65b8-4df1-b721-5827cf855528.png",
        hasWomen: true
      },
      {
        name: "KHAJA GHOUSE KHAN",
        department: "CSG",
        role: "STARTUP ADVISOR & STRATEGY",
        image: "/lovable-uploads/63586a25-3d6a-4930-82a5-d32f8c08d31b.png",
        hasWomen: false
      }
    ],
    "Technical Team": [
      {
        name: "SOHAIB AKTHAR",
        department: "CSE(AI&ML)",
        role: "LEAD",
        image: "/lovable-uploads/ee9928b1-9a18-42ff-b42f-aeebe26ffab8.png",
        hasWomen: false
      },
      {
        name: "PRANAY",
        department: "CSE",
        role: "CO-LEAD",
        image: "/lovable-uploads/9eb7e361-3016-4b0a-9e32-2fd7c970e9c5.png",
        hasWomen: false
      },
      {
        name: "ABDUL SOHAIL",
        department: "CSE",
        role: "TEAM MEMBER",
        image: "/lovable-uploads/61a7e0ed-db68-4489-9f78-6e49b4fe51d3.png",
        hasWomen: false
      },
      {
        name: "KARTHIK",
        department: "AI&DS",
        role: "TEAM MEMBER",
        image: "/lovable-uploads/8f3ebbb2-30c6-4700-ad68-bdd138ec7ffd.png",
        hasWomen: false
      },
      {
        name: "MOUNISH",
        department: "CSE(AI&ML)",
        role: "TEAM MEMBER",
        image: "/lovable-uploads/512ab9bf-63ef-4031-b3cb-baa12d02ad9e.png",
        hasWomen: false
      },
      {
        name: "AKASH",
        department: "CSE(AI&ML)",
        role: "TEAM MEMBER",
        image: "/lovable-uploads/6d340591-fff6-4077-92b8-a89fc8b382e4.png",
        hasWomen: false
      }
    ],
    "Design Team": [
      {
        name: "PRANAY",
        department: "CSE(AI&ML)",
        role: "LEAD",
        image: "/lovable-uploads/4655e3d5-079b-47b2-8a7b-1a2b312fd397.png",
        hasWomen: false
      },
      {
        name: "INDRA AKSHITH",
        department: "CSE",
        role: "CO-LEAD",
        image: "/lovable-uploads/d18f5d35-64c9-461e-9e21-a6085e410020.png",
        hasWomen: false
      },
      {
        name: "VARSHA",
        department: "AI&DS",
        role: "TEAM MEMBER",
        image: "/lovable-uploads/varsha-improved.png",
        hasWomen: true
      },
      {
        name: "VISHALAKSHI",
        department: "AI&DS",
        role: "TEAM MEMBER",
        image: "/lovable-uploads/cee1d9d7-2225-43da-8cb0-472e50aee52c.png",
        hasWomen: true
      },
      {
        name: "DHEEKSHA",
        department: "AI&DS",
        role: "TEAM MEMBER",
        image: "/lovable-uploads/83d199b8-e460-4d35-b425-8d1287a463ce.png",
        hasWomen: true
      }
    ],
    "Social Media": [
      {
        name: "BALA VARSHITH",
        department: "CSE(AI&ML)",
        role: "LEAD",
        image: "/lovable-uploads/7704c430-df61-421a-bf45-8940dd1b758b.png",
        hasWomen: false
      },
      {
        name: "SATHWIK",
        department: "IT",
        role: "CO-LEAD",
        image: "/lovable-uploads/ce8c2fa1-d866-4556-8175-f6a333fdfca9.png",
        hasWomen: false
      },
      {
        name: "SHIVANI",
        department: "AI&DS",
        role: "REPRESENTATIVE",
        image: "/lovable-uploads/cd28a257-7dd2-423a-a1dd-96042dd674fe.png",
        hasWomen: true
      },
      {
        name: "VIJAY MOHAN",
        department: "CSE(AI&ML)",
        role: "EDITOR",
        image: "/lovable-uploads/6c937623-16b7-436d-957d-c244f4b35fad.png",
        hasWomen: false
      }
    ],
    "Marketing Team": [
      {
        name: "KAMNA",
        department: "CSE(AI&ML)",
        role: "AD LEAD",
        image: "/lovable-uploads/0b76fc3e-8ab6-4889-865f-1ea85103e36d.png",
        hasWomen: true
      },
      {
        name: "AKSHITHA",
        department: "CSE(AI&ML)",
        role: "PR LEAD",
        image: "/lovable-uploads/0040bcc8-aea6-47d7-8f20-1a97013ac4aa.png",
        hasWomen: true
      },
      {
        name: "PRERANA",
        department: "AI&DS",
        role: "PR",
        image: "/lovable-uploads/8c2ef596-8313-430d-a28f-65069889e615.png",
        hasWomen: true
      }
    ]
  };

  return (
    <section id="team" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
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
          {Object.entries(teamMembers).map(([category, members], categoryIndex) => (
            <div
              key={category}
              className={`p-6 rounded-2xl bg-card/80 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + categoryIndex * 100}ms` }}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-4">{category}</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                    >
                      Show Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                    <DialogHeader className="pb-4">
                      <DialogTitle className="text-2xl font-bold text-center">
                        {category}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh] pr-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortMembersByHierarchy(members).map((member, memberIndex) => (
                          <div
                            key={memberIndex}
                            className="p-4 rounded-xl bg-card/50 border border-primary/10 text-center hover:border-primary/30 transition-colors"
                          >
                            <div className="mb-4 relative group">
                              {member.image ? (
                                <img 
                                  src={member.image} 
                                  alt={member.name}
                                  className={`w-20 h-20 object-cover rounded-full mx-auto border-3 border-primary/20 transition-transform duration-300 ${
                                    member.hasWomen ? '' : 'cursor-pointer hover:scale-110'
                                  }`}
                                  onClick={() => !member.hasWomen && window.open(member.image, '_blank')}
                                />
                              ) : (
                                <div className="w-20 h-20 bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-full mx-auto flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">Photo</span>
                                </div>
                              )}
                              {member.image && !member.hasWomen && (
                                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center cursor-pointer"
                                     onClick={() => window.open(member.image, '_blank')}>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                            <h4 className="text-lg font-bold text-foreground mb-2">{member.name}</h4>
                            <p className="text-sm text-muted-foreground mb-1">{member.department}</p>
                            <p className="text-sm font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 inline-block">
                              {member.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewTeam;