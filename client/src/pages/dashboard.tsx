
import { useState } from "react";
import { Link } from "wouter";
import { WorkoutPlanComponent } from "@/components/workout-plan";
import { DietTracker } from "@/components/diet-tracker";
import { ProgressChart } from "@/components/progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Activity, Target, Flame, Bell, Search, User, Home, Dumbbell, Apple, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fitness Goal</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold truncate">{user?.fitnessGoal || "Not set"}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activity Level</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold truncate">{user?.activityLevel || "Not set"}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">2000 kcal</div>
                </CardContent>
              </Card>
            </div>
            <ProgressChart />
          </div>
        );
      case 'workout':
        return <WorkoutPlanComponent />;
      case 'diet':
        return <DietTracker />;
      case 'chat':
        return <div className="p-4">Chat interface coming soon...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/profile">
              <button className="p-2">
                <User className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 px-4">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
        <div className="flex items-center justify-around p-2">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            size="icon"
            className="flex flex-col gap-1"
            onClick={() => setActiveTab('home')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant={activeTab === 'workout' ? 'default' : 'ghost'}
            size="icon"
            className="flex flex-col gap-1"
            onClick={() => setActiveTab('workout')}
          >
            <Dumbbell className="h-5 w-5" />
            <span className="text-xs">Workout</span>
          </Button>
          <Button
            variant={activeTab === 'diet' ? 'default' : 'ghost'}
            size="icon"
            className="flex flex-col gap-1"
            onClick={() => setActiveTab('diet')}
          >
            <Apple className="h-5 w-5" />
            <span className="text-xs">Diet</span>
          </Button>
          <Button
            variant={activeTab === 'chat' ? 'default' : 'ghost'}
            size="icon"
            className="flex flex-col gap-1"
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
