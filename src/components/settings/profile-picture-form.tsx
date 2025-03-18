'use client';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Slider } from '@/ui/slider';
import { Check, Move, RefreshCw, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { User } from '@/models/User';
import { patchRequest } from '@/lib/api';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
interface Props {
  children: React.ReactNode;
  user: User;
}

const ProfilePictureForm = ({ children, user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(user.avatar?.url || null);
  const [zoom, setZoom] = useState<number[]>([user.avatar?.zoom || 1]);
  const [rotation, setRotation] = useState(user.avatar?.rotation || 0);
  const [position, setPosition] = useState(user.avatar?.position || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Handle touch gestures
  const handleGestureZoom = useCallback((scale: number) => {
    setZoom(prev => [Math.max(0.5, Math.min(3, prev[0] * scale))]);
  }, []);

  const handleGestureRotate = useCallback((angle: number) => {
    setRotation(prev => prev + angle);
  }, []);

  useTouchGestures(imageContainerRef, handleGestureZoom, handleGestureRotate);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File size must be less than 10MB',
          description: 'Please try again with a smaller file',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (selectedImage) {
      await patchRequest('/users', {
        avatar: {
          url: selectedImage,
          rotation: rotation,
          zoom: zoom[0],
          position: {
            x: position.x,
            y: position.y,
          },
        },
      });
      toast({
        title: 'Profile picture updated',
      });
      router.refresh();
    }
    setIsOpen(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleOpenChange = (val: boolean) => {
    if (!selectedImage && val) triggerFileInput();
    else setIsOpen(val);
  };

  const handleRotate = (direction: 'clockwise' | 'counterclockwise') => {
    setRotation(prev => prev + (direction === 'clockwise' ? 90 : -90));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedImage) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!selectedImage || e.touches.length !== 1) return;

    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;

    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
          <DialogDescription>Crop, zoom, and rotate your profile picture</DialogDescription>
        </DialogHeader>

        {selectedImage && (
          <div className="flex flex-col items-center space-y-4">
            <div
              className="relative overflow-hidden h-64 w-64 rounded-full border-2 border-gray-200"
              ref={imageContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/20" />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/3 h-1/3 border border-white/30 rounded-full" />
                </div>
              </div>

              {/* Main image */}
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom[0]}) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
              />

              {/* Circular mask */}
              <div className="absolute inset-0 rounded-full box-border border-[9999px] border-black/50" />
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Zoom: {zoom[0].toFixed(1)}x</label>
                <Slider value={zoom} min={0.5} max={3} step={0.1} onValueChange={setZoom} />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleRotate('counterclockwise')}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleRotate('clockwise')}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setZoom([Math.max(0.5, zoom[0] - 0.1)])}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setZoom([Math.min(3, zoom[0] + 0.1)])}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Move className="h-4 w-4" />
                <span>Drag to position • Pinch to zoom</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveAvatar}>
            <Check className="mr-2 h-4 w-4" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureForm;
