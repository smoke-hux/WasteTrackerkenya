import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Recycle } from 'lucide-react';

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation('/role-selection');
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="absolute inset-0 bg-eco-green flex flex-col items-center justify-center z-50">
      <div className="text-white text-center">
        <div className="mb-8">
          <Recycle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">EcoCollect</h1>
          <p className="text-lg opacity-90">Smart Waste Management</p>
        </div>
        <div className="animate-pulse">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
