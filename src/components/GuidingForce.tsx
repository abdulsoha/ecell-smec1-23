import { useEffect, useRef, useState } from "react";
import { PhotoViewer } from "@/components/ui/photo-viewer";

const GuidingForce = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
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

  const guidingMembers = [
    {
      name: "Dr. Kasa Ravindra",
      title: "Director, St. Martin's Engineering College",
      image: "/lovable-uploads/ef187c9d-e977-41b0-822f-090c87e34934.png",
      message: "Entrepreneurship is not just about starting companies — it's about solving real-world problems with innovation, courage, and conviction. At St. Martin's, we believe in nurturing the entrepreneurial mindset, empowering students to challenge boundaries and lead with purpose. E-Cell SMEC stands as a dynamic platform where ideas take flight, leaders are born, and the future is built. I take immense pride in guiding this initiative and witnessing the spark of innovation grow brighter with each passing day."
    },
    {
      name: "Dr. Gowtham M",
      title: "Head of Department, CSE (AI & ML), St. Martin's Engineering College",
      image: "/lovable-uploads/8766379f-85f6-4113-84b6-a86f9819f012.png",
      message: "Artificial Intelligence and Entrepreneurship are shaping the world we live in. At the Department of CSE (AI & ML), we aim to blend technological excellence with an entrepreneurial spirit. The E-Cell SMEC is a powerful launchpad for our students to transform innovative ideas into impactful solutions. I am proud to support this initiative that cultivates creativity, leadership, and the confidence to build a better tomorrow."
    }
  ];

  // Convert to format compatible with PhotoViewer
  const photoViewerImages = guidingMembers.map(member => ({
    src: member.image,
    alt: `${member.name} - ${member.title}`,
    title: member.name
  }));

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowPhotoViewer(true);
  };

  const handleCloseViewer = () => {
    setShowPhotoViewer(false);
  };

  const handleNavigateImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <section id="guiding-force" ref={sectionRef} className="py-20 bg-card relative overflow-hidden">
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
            Meet Our <span className="text-primary">Guiding Force</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Visionary leaders who inspire and guide our entrepreneurial journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {guidingMembers.map((member, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl bg-background/80 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex-shrink-0 relative group">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-primary/20 cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => handleImageClick(index)}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Zoom indicator */}
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center cursor-pointer"
                       onClick={() => handleImageClick(index)}>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.title}</p>
                  <p className="text-muted-foreground leading-relaxed text-sm">{member.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Viewer Modal */}
      <PhotoViewer
        images={photoViewerImages}
        currentIndex={selectedImageIndex}
        isOpen={showPhotoViewer}
        onClose={handleCloseViewer}
        onNavigate={handleNavigateImage}
      />
    </section>
  );
};

export default GuidingForce;