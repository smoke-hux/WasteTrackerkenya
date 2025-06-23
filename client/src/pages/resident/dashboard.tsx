import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Clock, Camera, ChevronRight, Bell, User, Leaf, Recycle } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import BottomNav from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { ResidentDashboardData } from '@/lib/types';

export default function ResidentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'resident') {
      setLocation('/role-selection');
    }
  }, [user, setLocation]);

  const { data: dashboardData, isLoading } = useQuery<ResidentDashboardData>({
    queryKey: ['/api/dashboard/resident', user?.id],
    enabled: !!user?.id,
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="pb-20">
        {/* Header Skeleton */}
        <div className="bg-white p-4 shadow-sm border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="w-6 h-6" />
          </div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="p-4 bg-eco-green">
          <Skeleton className="h-4 w-20 mb-2 bg-white bg-opacity-30" />
          <div className="flex justify-between">
            <div>
              <Skeleton className="h-8 w-16 mb-1 bg-white bg-opacity-30" />
              <Skeleton className="h-3 w-20 bg-white bg-opacity-30" />
            </div>
            <div>
              <Skeleton className="h-8 w-20 mb-1 bg-white bg-opacity-30" />
              <Skeleton className="h-3 w-16 bg-white bg-opacity-30" />
            </div>
          </div>
        </div>
        
        {/* Action Cards Skeleton */}
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-eco-green rounded-full flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-eco-dark">{user.fullName}</h3>
              <p className="text-sm text-eco-gray">Resident</p>
            </div>
          </div>
          <button className="p-2">
            <Bell className="w-5 h-5 text-eco-gray" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-gradient-to-r from-eco-green to-eco-green-dark text-white">
        <h4 className="text-sm opacity-90 mb-2">This Month</h4>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">{dashboardData?.totalCollected.toFixed(1) || '0'} kg</p>
            <p className="text-sm opacity-90">Waste Collected</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">KSh {dashboardData?.totalEarnings.toFixed(0) || '0'}</p>
            <p className="text-sm opacity-90">Earned</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="p-4 space-y-4">
        <Link href="/resident/request-pickup">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-eco-green bg-opacity-10 rounded-xl flex items-center justify-center mr-4">
                  <Plus className="w-5 h-5 text-eco-green" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-eco-dark">Request Pickup</h3>
                  <p className="text-sm text-eco-gray">Schedule waste collection</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-eco-gray" />
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-eco-orange bg-opacity-10 rounded-xl flex items-center justify-center mr-4">
                <Clock className="w-5 h-5 text-eco-orange" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-eco-dark">Active Pickups</h3>
                <p className="text-sm text-eco-gray">Track your requests</p>
              </div>
            </div>
            <Badge className="bg-eco-orange text-white">
              {dashboardData?.activePickups.length || 0}
            </Badge>
          </CardContent>
        </Card>

        <Link href="/resident/report-dumping">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <Camera className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-eco-dark">Report Illegal Dumping</h3>
                  <p className="text-sm text-eco-gray">Help keep Kenya clean</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-eco-gray" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Personal Metrics */}
      <div className="p-4">
        <h4 className="font-semibold text-eco-dark mb-4">Your Impact</h4>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-eco-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-6 h-6 text-eco-green" />
                </div>
                <p className="text-2xl font-bold text-eco-dark">
                  {dashboardData?.co2Saved.toFixed(1) || '0'}
                </p>
                <p className="text-xs text-eco-gray">CO₂ Saved (kg)</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Recycle className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-eco-dark">
                  {dashboardData?.recyclingRate.toFixed(0) || '0'}%
                </p>
                <p className="text-xs text-eco-gray">Recycling Rate</p>
              </div>
            </div>

            {/* Waste Type Breakdown - Mock data for demonstration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-eco-gray">Organic</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-eco-green h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-eco-gray">Plastic</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-eco-gray">Paper</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav userRole="resident" />
    </div>
  );
}
