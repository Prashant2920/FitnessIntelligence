import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Apple, Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DietLog } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface Meal {
  name: string;
  calories: string;
}

interface DietLogWithParsedMeals extends Omit<DietLog, 'meals'> {
  meals: Meal[];
}

export function DietTracker() {
  const [meal, setMeal] = useState<Meal>({ name: "", calories: "" });

  const { data: logs, isLoading } = useQuery<DietLog[]>({
    queryKey: ["/api/diet-logs"]
  });

  const addMealMutation = useMutation({
    mutationFn: async (mealData: { meals: Meal[], totalCalories: number }) => {
      const res = await apiRequest("POST", "/api/diet-logs", mealData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diet-logs"] });
      setMeal({ name: "", calories: "" });
    }
  });

  const todaysLogs = logs?.filter(log => 
    new Date(log.date).toDateString() === new Date().toDateString()
  );

  const totalCalories = todaysLogs?.reduce((sum, log) => 
    sum + (log.totalCalories || 0), 0
  ) || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Apple className="mr-2 h-5 w-5" />
              Diet Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Today's Meals</h3>
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex justify-between p-2 bg-muted rounded-lg">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
              <div className="flex justify-between font-semibold mt-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Apple className="mr-2 h-5 w-5" />
            Diet Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Meal name"
              value={meal.name}
              onChange={e => setMeal(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Calories"
              value={meal.calories}
              onChange={e => setMeal(prev => ({ ...prev, calories: e.target.value }))}
            />
            <Button
              onClick={() => addMealMutation.mutate({
                meals: [meal],
                totalCalories: parseInt(meal.calories) || 0
              })}
              disabled={addMealMutation.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Today's Meals</h3>
            {todaysLogs?.map((log, index) => {
              const parsedLog = log as unknown as DietLogWithParsedMeals;
              return (
                <div key={index} className="flex justify-between p-2 bg-muted rounded-lg">
                  <div>
                    {parsedLog.meals.map((meal, i) => (
                      <p key={i}>{meal.name}</p>
                    ))}
                  </div>
                  <p>{log.totalCalories} cal</p>
                </div>
              );
            })}
            <div className="flex justify-between font-semibold mt-4">
              <p>Total Calories</p>
              <p>{totalCalories} cal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}