import { Layout } from "@/components/layout";
import { WorkoutPlanComponent } from "@/components/workout-plan";
import { DietTracker } from "@/components/diet-tracker";
import { ProgressChart } from "@/components/progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Activity, Target, Flame, Bell, Search, User } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-20 md:mb-0 mt-16 md:mt-0">
        <div className="flex items-center justify-between md:block">
          <h1 className="text-2xl md:text-3xl font-bold hidden md:block">Dashboard</h1>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fitness Goal
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold truncate">{user?.fitnessGoal || "Not set"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Activity Level
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold truncate">{user?.activityLevel || "Not set"}</div>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Calories
              </CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">2000 kcal</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="space-y-6">
            <WorkoutPlanComponent />
            <DietTracker />
          </div>
          <div>
            <ProgressChart />
          </div>
        </div>
      </div>
    </Layout>
  );
}