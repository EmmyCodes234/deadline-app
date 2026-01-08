import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCrop: (croppedFile: File) => void;
}

export function ImageCropperModal({ isOpen, imageUrl, onClose, onCrop }: ImageCropperModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && imageUrl) {
      const img = new Image();
      img.onload = () => {
        if (imageRef.current) {
          imageRef.current.src = imageUrl;
          setImageLoaded(true);
          drawCanvas();
        }
      };
      img.src = imageUrl;
    }
  }, [isOpen, imageUrl]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [scale, rotation, position, imageLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Fill with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    // Save context
    ctx.save();

    // Move to center
    ctx.translate(size / 2, size / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply scale
    ctx.scale(scale, scale);
    
    // Apply position
    ctx.translate(position.x, position.y);

    // Draw image centered
    const imgWidth = image.naturalWidth;
    const imgHeight = image.naturalHeight;
    const aspectRatio = imgWidth / imgHeight;
    
    let drawWidth = size;
    let drawHeight = size;
    
    if (aspectRatio > 1) {
      drawHeight = size / aspectRatio;
    } else {
      drawWidth = size * aspectRatio;
    }

    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    // Restore context
    ctx.restore();

    // Draw hexagon overlay
    drawHexagonOverlay(ctx, size);
  };

  const drawHexagonOverlay = (ctx: CanvasRenderingContext2D, size: number) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;

    // Create hexagon path
    const createHexagonPath = () => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
    };

    // Darken area outside hexagon
    ctx.save();
    
    // Fill entire canvas with dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, size, size);
    
    // Cut out hexagon shape
    createHexagonPath();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    
    ctx.restore();

    // Draw hexagon border
    ctx.save();
    createHexagonPath();
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleCrop = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create final cropped canvas
    const finalCanvas = document.createElement('canvas');
    const size = 512; // Final output size
    finalCanvas.width = size;
    finalCanvas.height = size;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    // Draw the current canvas content scaled to final size
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, size, size);

    // Convert to blob with optimization
    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
          onCrop(file);
        }
      },
      'image/jpeg',
      0.85 // Quality: 85%
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative z-10 bg-zinc-900 border border-white/10 rounded-lg p-6 max-w-lg w-full mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif text-white uppercase tracking-wider">
              Crop Avatar
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Canvas */}
          <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-auto cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <img ref={imageRef} className="hidden" alt="" />
          </div>

          {/* Instructions */}
          <p className="text-xs text-zinc-500 text-center mb-4 font-serif">
            Drag to reposition • Use controls to adjust
          </p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={handleZoomOut}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-zinc-300" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-zinc-300" />
            </button>
            <button
              onClick={handleRotate}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-5 h-5 text-zinc-300" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 text-zinc-300 uppercase tracking-wider text-sm font-serif"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="flex-1 px-6 py-3 bg-red-950/40 border border-red-500/50 rounded-lg hover:bg-red-950/60 transition-all duration-300 text-red-300 uppercase tracking-wider text-sm font-serif flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Apply
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
