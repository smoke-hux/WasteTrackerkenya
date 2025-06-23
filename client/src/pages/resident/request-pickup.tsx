import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Clock, Calendar } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import WasteTypeSelector from '@/components/waste-type-selector';
import { apiRequest } from '@/lib/queryClient';

export default function RequestPickup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [scheduledTime, setScheduledTime] = useState('now');

  // Get pricing estimate
  const { data: pricing, isLoading: pricingLoading } = useQuery({
    queryKey: ['/api/calculate-price', selectedWasteTypes, estimatedWeight],
    enabled: selectedWasteTypes.length > 0 && parseFloat(estimatedWeight) > 0,
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/calculate-price', {
        wasteTypes: selectedWasteTypes,
        weight: parseFloat(estimatedWeight) || 0
      });
      return response.json();
    }
  });

  const createPickupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/pickup-requests', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Pickup Requested!",
        description: "Your waste pickup request has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/resident'] });
      setLocation('/resident/dashboard');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit pickup request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    if (!user || selectedWasteTypes.length === 0 || !estimatedWeight) {
      toast({
        title: "Missing Information",
        description: "Please select waste types and enter estimated weight.",
        variant: "destructive",
      });
      return;
    }

    createPickupMutation.mutate({
      residentId: user.id,
      location: user.location || "123 Moi Avenue, Westlands, Nairobi",
      latitude: "-1.2921",
      longitude: "36.8219",
      wasteTypes: selectedWasteTypes,
      estimatedWeight,
      scheduledTime: scheduledTime === 'now' ? new Date() : null,
      notes: "Standard pickup request"
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 shadow-sm flex items-center">
        <Link href="/resident/dashboard">
          <button className="mr-4">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </Link>
        <h3 className="font-semibold text-foreground">Request Pickup</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Location */}
        <div>
          <Label className="text-sm font-medium text-eco-dark mb-2">Pickup Location</Label>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-eco-green mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-eco-dark">{user.location || "123 Moi Avenue"}</p>
                  <p className="text-sm text-eco-gray">Westlands, Nairobi</p>
                </div>
                <Button variant="ghost" size="sm" className="text-eco-green">
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waste Types */}
        <div>
          <Label className="text-sm font-medium text-eco-dark mb-3">Waste Types</Label>
          <WasteTypeSelector 
            selectedTypes={selectedWasteTypes}
            onTypesChange={setSelectedWasteTypes}
          />
        </div>

        {/* Estimated Weight */}
        <div>
          <Label htmlFor="weight" className="text-sm font-medium text-eco-dark mb-2">
            Estimated Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="Enter weight"
            value={estimatedWeight}
            onChange={(e) => setEstimatedWeight(e.target.value)}
            className="focus:border-eco-green"
          />
        </div>

        {/* Pricing Preview */}
        {pricing && !pricingLoading && (
          <Card className="bg-eco-light border-eco-green border-opacity-30">
            <CardContent className="p-4">
              <h4 className="font-medium text-eco-dark mb-2">Pricing Estimate</h4>
              <div className="space-y-2 text-sm">
                {pricing.breakdown.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-eco-gray capitalize">
                      {item.type} waste ({estimatedWeight} kg)
                    </span>
                    <span className="text-eco-dark">KSh {item.price.toFixed(0)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-eco-gray">Collection fee</span>
                  <span className="text-eco-dark">KSh {pricing.collectionFee}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between font-medium">
                  <span className="text-eco-dark">Total</span>
                  <span className="text-eco-green">KSh {pricing.totalPrice.toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule */}
        <div>
          <Label className="text-sm font-medium text-eco-dark mb-3">Pickup Time</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={scheduledTime === 'now' ? 'default' : 'outline'}
              className={`p-3 ${
                scheduledTime === 'now' 
                  ? 'bg-eco-green hover:bg-eco-green-dark' 
                  : 'border-gray-200 text-eco-gray'
              }`}
              onClick={() => setScheduledTime('now')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Now
            </Button>
            <Button
              variant={scheduledTime === 'schedule' ? 'default' : 'outline'}
              className={`p-3 ${
                scheduledTime === 'schedule' 
                  ? 'bg-eco-green hover:bg-eco-green-dark' 
                  : 'border-gray-200 text-eco-gray'
              }`}
              onClick={() => setScheduledTime('schedule')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-background border-t border-border">
        <Button 
          className="w-full bg-eco-green text-white py-4 rounded-2xl font-medium text-lg hover:bg-eco-green-dark"
          onClick={handleSubmit}
          disabled={createPickupMutation.isPending || selectedWasteTypes.length === 0 || !estimatedWeight}
        >
          {createPickupMutation.isPending 
            ? 'Requesting...' 
            : `Request Pickup - KSh ${pricing?.totalPrice?.toFixed(0) || '0'}`
          }
        </Button>
      </div>
    </div>
  );
}
