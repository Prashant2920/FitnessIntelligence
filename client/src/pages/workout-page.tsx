import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Dumbbell, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function WorkoutPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: workoutPlans, isLoading } = useQuery({
    queryKey: ["/api/workout-plans"],
  });

  const generateWorkoutMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const res = await apiRequest("POST", "/api/workout-plans", {
        fitnessGoal: user?.fitnessGoal,
        activityLevel: user?.activityLevel,
        experience: "beginner" // This could be part of the user profile
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate workout plan");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
      toast({
        title: "Success",
        description: "New workout plan generated!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Dumbbell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Workout Plans</h1>
              <p className="text-muted-foreground">
                View and manage your personalized workout plans
              </p>
            </div>
          </div>
          <Button 
            onClick={() => generateWorkoutMutation.mutate()}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Generate Plan
              </>
            )}
          </Button>
        </div>

        {workoutPlans?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted" />
              <h3 className="text-lg font-medium mb-2">No Workout Plans Yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first AI-powered workout plan to get started!
              </p>
              <Button
                onClick={() => generateWorkoutMutation.mutate()}
                disabled={isGenerating}
              >
                Generate Workout Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {workoutPlans?.map((plan: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Workout Plan {index + 1}
                    {plan.active && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plan.plan.exercises.map((exercise: any, i: number) => (
                      <div key={i} className="border-b pb-2 last:border-0">
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
