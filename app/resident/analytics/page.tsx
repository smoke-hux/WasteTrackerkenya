"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, Leaf, Droplet, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


export default function Analytics() {
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState('week');

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/waste-metrics', user?.id, timePeriod],
    enabled: !!user?.id,
  });

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['/api/collections', user?.id],
    enabled: !!user?.id,
  });

  if (!user) return null;

  if (isLoading || collectionsLoading) {
    return (
      <div className="min-h-screen bg-eco-light">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm border-b flex items-center">
          <Link href="/resident/dashboard">
            <button className="mr-4">
              <ArrowLeft className="w-5 h-5 text-eco-gray" />
            </button>
          </Link>
          <h3 className="font-semibold text-eco-dark">Analytics</h3>
        </div>

        <div className="p-4 space-y-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Calculate metrics from collections data
  const totalCollected = Array.isArray(collections) ? collections.reduce((sum: number, c: any) => sum + parseFloat(c.weight || '0'), 0) : 0;
  const totalEarnings = Array.isArray(collections) ? collections.reduce((sum: number, c: any) => sum + parseFloat(c.price || '0'), 0) : 0;
  const totalCO2Saved = Array.isArray(collections) ? collections.reduce((sum: number, c: any) => sum + parseFloat(c.co2Saved || '0'), 0) : 0;

  // Mock weekly data for chart
  const weeklyData = [
    { day: 'Mon', weight: 8.2 },
    { day: 'Tue', weight: 12.5 },
    { day: 'Wed', weight: 15.8 },
    { day: 'Thu', weight: 9.3 },
    { day: 'Fri', weight: 14.1 },
    { day: 'Sat', weight: 11.7 },
    { day: 'Sun', weight: 6.9 },
  ];

  const maxWeight = Math.max(...weeklyData.map(d => d.weight));

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 shadow-sm flex items-center">
        <Link href="/resident/dashboard">
          <button className="mr-4">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </Link>
        <h3 className="font-semibold text-foreground">Analytics</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Time Period Selector */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {['week', 'month', 'year'].map((period) => (
            <Button
              key={period}
              variant={timePeriod === period ? 'default' : 'ghost'}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                timePeriod === period 
                  ? 'bg-white shadow-sm text-eco-dark' 
                  : 'text-eco-gray'
              }`}
              onClick={() => setTimePeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-eco-green" />
                <span className="text-xs text-eco-gray">+12%</span>
              </div>
              <p className="text-2xl font-bold text-eco-dark">{totalCollected.toFixed(1)} kg</p>
              <p className="text-sm text-eco-gray">Total Collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-eco-orange" />
                <span className="text-xs text-eco-gray">+8%</span>
              </div>
              <p className="text-2xl font-bold text-eco-dark">KSh {totalEarnings.toFixed(0)}</p>
              <p className="text-sm text-eco-gray">Total Earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Leaf className="w-5 h-5 text-green-500" />
                <span className="text-xs text-eco-gray">+15%</span>
              </div>
              <p className="text-2xl font-bold text-eco-dark">{totalCO2Saved.toFixed(1)} kg</p>
              <p className="text-sm text-eco-gray">CO₂ Saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-eco-gray">-2%</span>
              </div>
              <p className="text-2xl font-bold text-eco-dark">89%</p>
              <p className="text-sm text-eco-gray">Recycling Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Collection Trend Chart */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-eco-dark mb-4">Weekly Collection Trend</h4>
            <div className="h-32 flex items-end justify-between space-x-2">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-eco-green rounded-t"
                    style={{ height: `${(data.weight / maxWeight) * 100}%` }}
                  ></div>
                  <span className="text-xs text-eco-gray mt-2">{data.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Waste Breakdown */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-eco-dark mb-4">Waste Type Breakdown</h4>
            <div className="space-y-3">
              {[
                { type: 'Organic', weight: 45.2, percentage: 38, color: 'bg-eco-green' },
                { type: 'Plastic', weight: 32.1, percentage: 27, color: 'bg-blue-500' },
                { type: 'Paper', weight: 28.4, percentage: 24, color: 'bg-yellow-500' },
                { type: 'Metal', weight: 13.2, percentage: 11, color: 'bg-gray-500' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 ${item.color} rounded mr-3`}></div>
                    <span className="text-sm text-eco-gray">{item.type}</span>
                  </div>
                  <span className="text-sm font-medium text-eco-dark">
                    {item.weight} kg ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-100">
          <CardContent className="p-4">
            <h4 className="font-semibold text-eco-dark mb-3">Environmental Impact</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Leaf className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm text-eco-dark">Trees Saved</span>
                </div>
                <span className="text-sm font-bold text-green-600">2.3 trees</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Droplet className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-sm text-eco-dark">Water Saved</span>
                </div>
                <span className="text-sm font-bold text-blue-600">147 liters</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-3" />
                  <span className="text-sm text-eco-dark">Energy Saved</span>
                </div>
                <span className="text-sm font-bold text-yellow-600">42.1 kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
