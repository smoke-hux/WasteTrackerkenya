"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Truck, MapPin, Weight, Route, Clock, Navigation } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import BottomNav from '@/components/bottom-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { CollectorDashboardData } from '@/lib/types';

export default function CollectorDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'collector') {
      router.push('/role-selection');
    }
  }, [user, router]);

  const { data: dashboardData, isLoading } = useQuery<CollectorDashboardData>({
    queryKey: ['/api/dashboard/collector', user?.id],
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
            <div className="flex items-center space-x-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="p-4 bg-eco-orange">
          <Skeleton className="h-4 w-32 mb-2 bg-white bg-opacity-30" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1 bg-white bg-opacity-30" />
                <Skeleton className="h-3 w-16 mx-auto bg-white bg-opacity-30" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Jobs Skeleton */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-eco-orange rounded-full flex items-center justify-center mr-3">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">Collector</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-eco-green rounded-full"></div>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="p-4 bg-gradient-to-r from-eco-orange to-orange-600 text-white">
        <h4 className="text-sm opacity-90 mb-2">Today's Performance</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold">{dashboardData?.todayJobs || 0}</p>
            <p className="text-xs opacity-90">Jobs Completed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{dashboardData?.todayWeight.toFixed(1) || '0'} kg</p>
            <p className="text-xs opacity-90">Waste Collected</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">KSh {dashboardData?.todayEarnings.toFixed(0) || '0'}</p>
            <p className="text-xs opacity-90">Earned</p>
          </div>
        </div>
      </div>

      {/* Available Jobs */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-eco-dark">Available Jobs</h4>
          <Button variant="ghost" className="text-eco-orange text-sm font-medium p-0">
            View All
          </Button>
        </div>

        {/* Job Cards */}
        <div className="space-y-3">
          {dashboardData?.availableJobs.slice(0, 2).map((job: any) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-eco-green bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-eco-green" />
                    </div>
                    <div>
                      <h5 className="font-medium text-eco-dark">Residential Pickup</h5>
                      <p className="text-sm text-eco-gray">{job.location}</p>
                    </div>
                  </div>
                  <span className="text-eco-green text-sm font-medium">
                    KSh {parseFloat(job.totalPrice || '0').toFixed(0)}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Weight className="w-4 h-4 text-eco-gray mx-auto mb-1" />
                    <p className="text-eco-dark font-medium">{job.estimatedWeight} kg</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Route className="w-4 h-4 text-eco-gray mx-auto mb-1" />
                    <p className="text-eco-dark font-medium">2.1 km</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Clock className="w-4 h-4 text-eco-gray mx-auto mb-1" />
                    <p className="text-eco-dark font-medium">5 min</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-eco-green text-white hover:bg-eco-green-dark">
                    Accept
                  </Button>
                  <Button variant="outline" className="px-4 border-gray-200 text-eco-gray">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) || (
            <Card>
              <CardContent className="p-8 text-center">
                <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No available jobs right now</p>
                <p className="text-sm text-gray-400">Check back later for new pickup requests</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Active Job Banner */}
      {dashboardData?.activeJob && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <Card className="bg-eco-green text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Collecting from {dashboardData.activeJob.location}</p>
                  <p className="text-sm opacity-90">Estimated arrival: 3 min</p>
                </div>
                <Link href={`/collector/active-collection/${dashboardData.activeJob.id}`}>
                  <Button size="sm" className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2">
                    <Navigation className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <BottomNav userRole="collector" />
    </div>
  );
}
