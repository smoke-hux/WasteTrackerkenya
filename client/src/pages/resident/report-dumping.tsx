import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import PhotoCapture from '@/components/photo-capture';
import { apiRequest } from '@/lib/queryClient';
import { DUMPING_WASTE_TYPES, URGENCY_LEVELS } from '@/lib/types';

export default function ReportDumping() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [photo, setPhoto] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [urgency, setUrgency] = useState('');

  const reportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/dumping-reports', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted!",
        description: "Thank you for helping keep Kenya clean. Authorities have been notified.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dumping-reports'] });
      setLocation('/resident/dashboard');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    if (!user || !description || !wasteType || !urgency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Get current location (simplified - in real app would use GPS)
    const latitude = "-1.2921";
    const longitude = "36.8219";

    reportMutation.mutate({
      reporterId: user.id,
      location: "Current Location",
      latitude,
      longitude,
      description,
      wasteType,
      urgency,
      photoUrl: photo ? "captured_photo.jpg" : null // In real app, would upload to storage
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-eco-light">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b flex items-center">
        <Link href="/resident/dashboard">
          <button className="mr-4">
            <ArrowLeft className="w-5 h-5 text-eco-gray" />
          </button>
        </Link>
        <h3 className="font-semibold text-eco-dark">Report Illegal Dumping</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Photo Capture */}
        <div>
          <Label className="text-sm font-medium text-eco-dark mb-3">Take Photo</Label>
          <PhotoCapture 
            onPhotoCapture={setPhoto}
            captured={!!photo}
          />
        </div>

        {/* Location */}
        <div>
          <Label className="text-sm font-medium text-eco-dark mb-2">Location</Label>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-red-500 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-eco-dark">Current Location</p>
                  <p className="text-sm text-eco-gray">GPS: -1.2921, 36.8219</p>
                </div>
                <Button variant="ghost" size="sm" className="text-eco-green">
                  Use Current
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-eco-dark mb-2">
            Description
          </Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Describe what you see... (e.g., Large pile of household waste dumped on roadside)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none focus:border-eco-green"
          />
        </div>

        {/* Waste Type */}
        <div>
          <Label className="text-sm font-medium text-eco-dark mb-3">Type of Waste</Label>
          <RadioGroup value={wasteType} onValueChange={setWasteType}>
            <div className="grid grid-cols-2 gap-3">
              {DUMPING_WASTE_TYPES.map((type) => (
                <Label
                  key={type.id}
                  className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-red-500 has-[:checked]:border-red-500 has-[:checked]:bg-red-50"
                >
                  <RadioGroupItem value={type.id} className="mr-3" />
                  <span className="text-sm">{type.label}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Urgency */}
        <div>
          <Label className="text-sm font-medium text-eco-dark mb-3">Urgency Level</Label>
          <RadioGroup value={urgency} onValueChange={setUrgency}>
            <div className="space-y-2">
              {URGENCY_LEVELS.map((level) => (
                <Label
                  key={level.id}
                  className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                    level.color === 'yellow' 
                      ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-400 has-[:checked]:border-yellow-400'
                      : level.color === 'orange'
                      ? 'border-orange-200 bg-orange-50 hover:border-orange-400 has-[:checked]:border-orange-400'
                      : 'border-red-200 bg-red-50 hover:border-red-400 has-[:checked]:border-red-400'
                  }`}
                >
                  <RadioGroupItem value={level.id} className="mr-3" />
                  <span className={`text-sm font-medium ${
                    level.color === 'yellow' 
                      ? 'text-yellow-700'
                      : level.color === 'orange'
                      ? 'text-orange-700'
                      : 'text-red-700'
                  }`}>
                    {level.label}
                  </span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100">
        <Button 
          className="w-full bg-red-500 text-white py-4 rounded-2xl font-medium text-lg hover:bg-red-600"
          onClick={handleSubmit}
          disabled={reportMutation.isPending || !description || !wasteType || !urgency}
        >
          {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );
}
