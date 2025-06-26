"use client";

import { useEffect } from 'react';
import { Home, Truck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Recycle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ThemeToggle } from '@/components/theme-toggle';

export default function RoleSelection() {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to their dashboard
    if (user) {
      const dashboardPath = user.role === 'resident' 
        ? '/resident/dashboard' 
        : '/collector/dashboard';
      router.push(dashboardPath);
    }
  }, [user, router]);

  const handleRoleSelect = (role: 'resident' | 'collector') => {
    // Redirect to login page instead of auto-login
    router.push('/login');
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center mb-12">
        <Recycle className="w-12 h-12 text-eco-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to YUGI</h2>
        <p className="text-muted-foreground">Choose your role to continue</p>
      </div>

      <div className="space-y-4">
        <Link href="/resident/dashboard">
          <button 
            onClick={() => handleRoleSelect('resident')}
            className="w-full bg-eco-green text-white p-6 rounded-2xl flex items-center justify-between hover:bg-eco-green-dark transition-colors"
          >
            <div className="flex items-center">
              <Home className="w-6 h-6 mr-4" />
              <div className="text-left">
                <h3 className="font-semibold text-lg">I'm a Resident</h3>
                <p className="text-sm opacity-90">Request waste pickup</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </Link>

        <Link href="/collector/dashboard">
          <button 
            onClick={() => handleRoleSelect('collector')}
            className="w-full bg-eco-orange text-white p-6 rounded-2xl flex items-center justify-between hover:bg-orange-600 transition-colors"
          >
            <div className="flex items-center">
              <Truck className="w-6 h-6 mr-4" />
              <div className="text-left">
                <h3 className="font-semibold text-lg">I'm a Collector</h3>
                <p className="text-sm opacity-90">Accept pickup jobs</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}