"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Recycle, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    location: '',
    role: 'resident' as 'resident' | 'collector'
  });

  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Login the user with JWT tokens
      login(data.user, data.accessToken, data.refreshToken);

      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin 
          ? "You have been successfully logged in." 
          : "Your account has been created and you are now logged in."
      });

      // Redirect to appropriate dashboard
      const redirectPath = data.user.role === 'resident' 
        ? '/resident/dashboard' 
        : '/collector/dashboard';
      router.push(redirectPath);

    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green to-blue-600 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Recycle className="h-10 w-10 text-eco-green" />
            <h1 className="text-2xl font-bold text-eco-dark">YUGI</h1>
          </div>
          <CardTitle className="text-xl">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isLogin 
              ? 'Sign in to track your waste collection' 
              : 'Join the waste management community'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+254712345678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Nairobi, Kenya"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value: 'resident' | 'collector') => 
                      handleInputChange('role', value)
                    }
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="resident" id="resident" />
                      <Label htmlFor="resident" className="cursor-pointer">
                        Resident - Request waste pickup services
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="collector" id="collector" />
                      <Label htmlFor="collector" className="cursor-pointer">
                        Collector - Provide waste collection services
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-eco-green hover:bg-eco-green-dark"
              disabled={isLoading}
            >
              {isLoading 
                ? (isLogin ? 'Signing in...' : 'Creating account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-eco-green hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {/* Demo Access */}
          <div className="border-t pt-4">
            <p className="text-xs text-center text-muted-foreground mb-2">
              Quick demo access:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: 'resident@demo.com',
                        password: 'demo123'
                      })
                    });
                    const data = await response.json();
                    if (response.ok) {
                      login(data.user, data.accessToken, data.refreshToken);
                      router.push('/resident/dashboard');
                    }
                  } catch (error) {
                    console.error('Demo login failed:', error);
                  }
                }}
                className="text-xs"
              >
                Demo Resident
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: 'collector@demo.com',
                        password: 'demo123'
                      })
                    });
                    const data = await response.json();
                    if (response.ok) {
                      login(data.user, data.accessToken, data.refreshToken);
                      router.push('/collector/dashboard');
                    }
                  } catch (error) {
                    console.error('Demo login failed:', error);
                  }
                }}
                className="text-xs"
              >
                Demo Collector
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}