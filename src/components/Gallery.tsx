import { useEffect, useRef, useState } from "react";
import { PhotoViewer } from "@/components/ui/photo-viewer";

const Gallery = () => {
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

  const galleryImages = [
    {
      src: "/lovable-uploads/34aa855f-8cb5-4cd1-86cf-61eebc77da87.png",
      alt: "E-Cell SMEC Team Group Photo - High Resolution",
      title: "Our Amazing Team",
      hasWomen: true // Privacy flag to disable zoom
    }
  ];

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
    <section id="gallery" ref={sectionRef} className="py-20 bg-card relative overflow-hidden">
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
            Our <span className="text-primary">Gallery</span>
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Capturing moments of innovation, collaboration, and entrepreneurial spirit.
          </p>
        </div>

        <div className={`flex justify-center transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-background/80 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 max-w-md cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Hover overlay for better UX */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                    <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Click to view & download HD</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">{image.title}</h3>
                <p className="text-sm text-muted-foreground">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-muted-foreground">
            More amazing moments coming soon! 📸
          </p>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      <PhotoViewer
        images={galleryImages}
        currentIndex={selectedImageIndex}
        isOpen={showPhotoViewer}
        onClose={handleCloseViewer}
        onNavigate={handleNavigateImage}
        disableZoom={galleryImages[selectedImageIndex]?.hasWomen}
      />
    </section>
  );
};

export default Gallery;