"use client";

import { Home, Map, BarChart3, User, Truck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface BottomNavProps {
  userRole: 'resident' | 'collector';
}

export default function BottomNav({ userRole }: BottomNavProps) {
  const pathname = usePathname();

  const residentNavItems = [
    { path: '/resident/dashboard', icon: Home, label: 'Home' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/resident/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const collectorNavItems = [
    { path: '/collector/dashboard', icon: Home, label: 'Jobs' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/collector/earnings', icon: TrendingUp, label: 'Earnings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const navItems = userRole === 'resident' ? residentNavItems : collectorNavItems;

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background border-t border-border px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button 
                className={`p-3 flex flex-col items-center ${
                  isActive 
                    ? userRole === 'resident' 
                      ? 'text-eco-green' 
                      : 'text-eco-orange'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
