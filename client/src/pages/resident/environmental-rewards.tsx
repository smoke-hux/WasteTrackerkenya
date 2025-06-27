import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award, Leaf, Trophy, BookOpen, Zap, Target, Calendar, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import BottomNav from '@/components/bottom-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface Achievement {
  id: number;
  achievementType: string;
  level: number;
  title: string;
  description: string;
  environmentalInfo: string;
  unlockedAt: string;
  wasteThreshold?: number;
  co2Threshold?: number;
}

interface UserProgress {
  totalWasteCollected: string;
  totalCo2Saved: string;
  currentStreak: number;
  longestStreak: number;
  achievementPoints: number;
  unlockedInfoCount: number;
}

interface EnvironmentalInfo {
  id: number;
  category: string;
  title: string;
  content: string;
  difficulty: string;
  unlockLevel: number;
  imageUrl?: string;
  sources: string[];
}

export default function EnvironmentalRewards() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<EnvironmentalInfo | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'resident') {
      setLocation('/role-selection');
    }
  }, [user, setLocation]);

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/environmental/achievements', user?.id],
    enabled: !!user?.id,
  });

  const { data: userProgress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: ['/api/environmental/progress', user?.id],
    enabled: !!user?.id,
  });

  const { data: environmentalInfo, isLoading: infoLoading } = useQuery<EnvironmentalInfo[]>({
    queryKey: ['/api/environmental/info', user?.id],
    enabled: !!user?.id,
  });

  if (!user) return null;

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'waste_milestone': return <Leaf className="w-5 h-5" />;
      case 'co2_milestone': return <Zap className="w-5 h-5" />;
      case 'consistency': return <Calendar className="w-5 h-5" />;
      case 'diversity': return <Target className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'waste_milestone': return 'bg-green-500';
      case 'co2_milestone': return 'bg-blue-500';
      case 'consistency': return 'bg-orange-500';
      case 'diversity': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recycling': return '♻️';
      case 'climate': return '🌍';
      case 'wildlife': return '🦁';
      case 'pollution': return '🌊';
      case 'conservation': return '🌱';
      default: return '📚';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (achievementsLoading || progressLoading || infoLoading) {
    return (
      <div className="pb-20">
        {/* Header Skeleton */}
        <div className="bg-background border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="w-6 h-6" />
          </div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="w-6 h-6 text-eco-green mr-2" />
            <h1 className="text-xl font-bold text-foreground">Environmental Rewards</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Progress Overview */}
      <div className="p-4 bg-gradient-to-r from-eco-green to-eco-green-dark text-white">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{parseFloat(userProgress?.totalWasteCollected || '0').toFixed(1)} kg</p>
            <p className="text-sm opacity-90">Total Waste Collected</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{userProgress?.achievementPoints || 0}</p>
            <p className="text-sm opacity-90">Achievement Points</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold">{userProgress?.unlockedInfoCount || 0}</p>
            <p className="text-sm opacity-90">Info Unlocked</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{userProgress?.currentStreak || 0}</p>
            <p className="text-sm opacity-90">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="info">Environmental Info</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Achievements</h3>
              <Badge variant="secondary">{achievements?.length || 0} unlocked</Badge>
            </div>

            {achievements && achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-12 h-12 ${getAchievementColor(achievement.achievementType)} rounded-full flex items-center justify-center text-white`}>
                            {getAchievementIcon(achievement.achievementType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                              <Badge variant="outline">Level {achievement.level}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedAchievement(achievement)}>
                              <BookOpen className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <div className={`w-8 h-8 ${getAchievementColor(achievement.achievementType)} rounded-full flex items-center justify-center text-white`}>
                                  {getAchievementIcon(achievement.achievementType)}
                                </div>
                                <span>{achievement.title}</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 flex items-center">
                                  <Leaf className="w-4 h-4 mr-2 text-eco-green" />
                                  Did You Know?
                                </h4>
                                <p className="text-sm">{achievement.environmentalInfo}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start collecting waste to unlock environmental insights!
                  </p>
                  <Link href="/resident/request-pickup">
                    <Button className="mt-4 bg-eco-green hover:bg-eco-green-dark">
                      Request Pickup
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Environmental Library</h3>
              <Badge variant="secondary">{environmentalInfo?.length || 0} available</Badge>
            </div>

            {environmentalInfo && environmentalInfo.length > 0 ? (
              <div className="space-y-3">
                {environmentalInfo.map((info) => (
                  <Card key={info.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{getCategoryIcon(info.category)}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-foreground">{info.title}</h4>
                              <Badge className={getDifficultyColor(info.difficulty)}>
                                {info.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {info.content.substring(0, 100)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Category: {info.category} • Level {info.unlockLevel}
                            </p>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedInfo(info)}>
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <span className="text-2xl">{getCategoryIcon(info.category)}</span>
                                <span>{info.title}</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Badge className={getDifficultyColor(info.difficulty)}>
                                  {info.difficulty}
                                </Badge>
                                <Badge variant="outline">Level {info.unlockLevel}</Badge>
                              </div>
                              
                              <div className="prose prose-sm max-w-none">
                                <p>{info.content}</p>
                              </div>

                              {info.sources && info.sources.length > 0 && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-sm mb-2">Sources:</h4>
                                  <div className="space-y-1">
                                    {info.sources.map((source, idx) => (
                                      <p key={idx} className="text-xs text-muted-foreground">
                                        • {source}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No environmental info available</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Complete more collections to unlock environmental insights!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav userRole="resident" />
    </div>
  );
}