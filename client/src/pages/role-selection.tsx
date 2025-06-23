import { Home, Truck, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { Recycle } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function RoleSelection() {
  const { login } = useAuth();

  const handleRoleSelect = (role: 'resident' | 'collector') => {
    // In a real app, this would show a login form
    // For demo purposes, we'll use preset users
    const demoUser = {
      id: role === 'resident' ? 1 : 2,
      username: role === 'resident' ? 'john_kamau' : 'david_mwangi',
      role,
      fullName: role === 'resident' ? 'John Kamau' : 'David Mwangi',
      phone: role === 'resident' ? '+254712345678' : '+254798765432',
      location: role === 'resident' ? 'Westlands, Nairobi' : 'Nairobi'
    };
    
    login(demoUser);
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-12">
        <Recycle className="w-12 h-12 text-eco-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-eco-dark mb-2">Welcome to EcoCollect</h2>
        <p className="text-eco-gray">Choose your role to continue</p>
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
