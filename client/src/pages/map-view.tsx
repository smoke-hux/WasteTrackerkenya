import { ArrowLeft, Plus, Minus, Crosshair } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MapView() {
  const [, setLocation] = useLocation();

  const goBack = () => {
    // Simple back navigation - could be improved with proper history
    setLocation('/resident/dashboard');
  };

  // Mock aerial view of Nairobi for demonstration
  const mapBackground = "https://images.unsplash.com/photo-1519821172144-4f87d85de2a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

  return (
    <div className="relative h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur p-4 z-10 flex items-center">
        <Button 
          onClick={goBack}
          size="sm" 
          className="mr-4 bg-white shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-eco-gray" />
        </Button>
        <h3 className="font-semibold text-eco-dark">Live Map</h3>
      </div>

      {/* Mock Map */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${mapBackground})` }}
      >
        {/* Map Markers */}
        <div className="absolute top-1/3 left-1/3 bg-eco-green p-2 rounded-full shadow-lg">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <div className="absolute top-1/2 right-1/3 bg-eco-orange p-2 rounded-full shadow-lg">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <div className="absolute top-2/3 left-1/2 bg-red-500 p-2 rounded-full shadow-lg">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>

        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path 
            d="M 120 200 Q 200 150 300 250" 
            stroke="#22C55E" 
            strokeWidth="4" 
            strokeDasharray="5,5" 
            fill="none" 
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-24 right-4 space-y-2">
        <Button size="sm" className="bg-white shadow-lg p-3">
          <Crosshair className="w-4 h-4 text-eco-gray" />
        </Button>
        <Button size="sm" className="bg-white shadow-lg p-3">
          <Plus className="w-4 h-4 text-eco-gray" />
        </Button>
        <Button size="sm" className="bg-white shadow-lg p-3">
          <Minus className="w-4 h-4 text-eco-gray" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-24 left-4">
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-eco-green rounded-full mr-2"></div>
                <span>Pickup Requests</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-eco-orange rounded-full mr-2"></div>
                <span>Active Collectors</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Illegal Dumping</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
