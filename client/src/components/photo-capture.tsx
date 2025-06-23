import { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoCaptureProps {
  onPhotoCapture: (file: File) => void;
  captured?: boolean;
}

export default function PhotoCapture({ onPhotoCapture, captured = false }: PhotoCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onPhotoCapture(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Captured evidence" 
            className="w-full h-48 object-cover rounded-xl"
          />
          <Button
            onClick={triggerFileInput}
            className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-eco-dark hover:bg-opacity-100"
            size="sm"
          >
            <Camera className="w-4 h-4 mr-1" />
            Retake
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Tap to capture evidence</p>
          <Button 
            onClick={triggerFileInput}
            className="bg-eco-green text-white hover:bg-eco-green-dark"
          >
            <Camera className="w-4 h-4 mr-2" />
            Open Camera
          </Button>
        </div>
      )}
    </div>
  );
}
