"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Phone, MapPin, Route, User, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActiveCollection() {
  const { id } = useParams();

  const { data: pickupRequest, isLoading } = useQuery({
    queryKey: ['/api/pickup-requests', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await fetch(`/api/pickup-requests/${id}`);
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="relative h-screen">
        {/* Header Skeleton */}
        <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur p-4 z-10 flex items-center justify-between">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        
        {/* Map Area */}
        <div className="h-screen bg-gray-200"></div>
        
        {/* Bottom Card Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Skeleton className="w-12 h-12 rounded-full mr-3" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="h-16 w-full rounded-xl mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Mock map background - in real app would use Google Maps
  const mapBackground = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

  return (
    <div className="relative h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur p-4 z-10 flex items-center justify-between">
        <Link href="/collector/dashboard">
          <Button size="sm" className="bg-white shadow-sm">
            <ArrowLeft className="w-4 h-4 text-eco-gray" />
          </Button>
        </Link>
        <h3 className="font-semibold text-eco-dark">Active Collection</h3>
        <Button size="sm" className="bg-white shadow-sm">
          <Phone className="w-4 h-4 text-eco-green" />
        </Button>
      </div>

      {/* Mock Map with Route */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${mapBackground})` }}
      >
        {/* Current Location (Collector) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-eco-orange p-3 rounded-full shadow-lg animate-pulse">
          <MapPin className="w-6 h-6 text-white" />
        </div>

        {/* Destination (Customer) */}
        <div className="absolute top-1/3 right-1/4 bg-eco-green p-3 rounded-full shadow-lg">
          <MapPin className="w-6 h-6 text-white" />
        </div>

        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path 
            d="M 200 300 Q 250 200 320 180" 
            stroke="#F97316" 
            strokeWidth="6" 
            fill="none" 
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Collection Details Card */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-eco-green bg-opacity-10 rounded-full flex items-center justify-center mr-3">
              <User className="w-6 h-6 text-eco-green" />
            </div>
            <div>
              <h4 className="font-semibold text-eco-dark">Customer Pickup</h4>
              <p className="text-sm text-eco-gray">{pickupRequest?.location || 'Westlands, Nairobi'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-eco-green">
              KSh {parseFloat(pickupRequest?.totalPrice || '180').toFixed(0)}
            </p>
            <p className="text-sm text-eco-gray">
              {pickupRequest?.estimatedWeight || '15.2'} kg
            </p>
          </div>
        </div>

        {/* Navigation Info */}
        <Card className="bg-eco-light mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Route className="w-5 h-5 text-eco-orange mr-3" />
                <div>
                  <p className="font-medium text-eco-dark">2.1 km remaining</p>
                  <p className="text-sm text-eco-gray">Estimated arrival: 3 min</p>
                </div>
              </div>
              <Button className="bg-eco-orange text-white hover:bg-orange-600">
                Navigate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-eco-green text-white hover:bg-eco-green-dark">
            <Check className="w-4 h-4 mr-2" />
            Arrived
          </Button>
          <Button variant="outline" className="border-gray-200 text-eco-gray">
            <Phone className="w-4 h-4 mr-2" />
            Call Customer
          </Button>
        </div>
      </div>
    </div>
  );
}
