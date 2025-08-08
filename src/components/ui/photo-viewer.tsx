import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface PhotoViewerProps {
  images: { src: string; alt: string; title?: string; hasWomen?: boolean }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (index: number) => void;
  disableZoom?: boolean;
}

export const PhotoViewer = ({ images, currentIndex, isOpen, onClose, onNavigate, disableZoom = false }: PhotoViewerProps) => {
  const [zoom, setZoom] = useState(1);

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && onNavigate) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1 && onNavigate) {
      onNavigate(currentIndex + 1);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  if (!images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 disabled:opacity-30"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 disabled:opacity-30"
                onClick={handleNext}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
            {!disableZoom && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <span className="text-white px-2 py-1 bg-black/50 rounded text-sm">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => handleDownload(currentImage.src, `${currentImage.title || currentImage.alt}.jpg`)}
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 z-50 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Main Image */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: disableZoom ? 'scale(1)' : `scale(${zoom})` }}
              draggable={false}
            />
          </div>

          {/* Image Info */}
          {currentImage.title && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 text-white bg-black/50 px-4 py-2 rounded-lg text-center max-w-md">
              <h3 className="font-semibold">{currentImage.title}</h3>
              {currentImage.alt !== currentImage.title && (
                <p className="text-sm opacity-80">{currentImage.alt}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};