import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, RotateCw } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { WorkoutPlan } from "@shared/schema";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

interface WorkoutPlanData {
  [key: string]: Exercise[];
}

export function WorkoutPlanComponent() {
  const { data: plans, isLoading } = useQuery<WorkoutPlan[]>({
    queryKey: ["/api/workout-plans"]
  });

  const generatePlanMutation = useMutation({
    mutationFn: async (userData: unknown) => {
      const res = await apiRequest("POST", "/api/workout-plans", userData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
    }
  });

  if (isLoading) {
    return <div>Loading workout plans...</div>;
  }

  const activePlan = plans?.find(plan => plan.active);
  const workoutData = activePlan?.plan as WorkoutPlanData;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workout Plan</h2>
        <Button 
          onClick={() => generatePlanMutation.mutate({})}
          disabled={generatePlanMutation.isPending}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Generate New Plan
        </Button>
      </div>

      {activePlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Dumbbell className="mr-2 h-5 w-5" />
              Today's Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(workoutData).map(([muscle, exercises]) => (
                <div key={muscle} className="space-y-2">
                  <h3 className="font-semibold capitalize">{muscle}</h3>
                  {exercises.map((exercise: Exercise, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p>No active workout plan. Generate one to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}