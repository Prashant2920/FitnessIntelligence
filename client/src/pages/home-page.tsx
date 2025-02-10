import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Dumbbell, Brain, LineChart, Bot } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FitAI</span>
        </div>
        <nav>
          <Link href={user ? "/dashboard" : "/auth"}>
            <Button>{user ? "Dashboard" : "Get Started"}</Button>
          </Link>
        </nav>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your AI-Powered <span className="text-primary">Fitness Journey</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your fitness with personalized AI workout plans, smart nutrition tracking, and real-time progress monitoring.
            </p>
            <Link href="/auth">
              <Button size="lg" className="animate-pulse">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-background rounded-lg">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Workouts</h3>
                <p className="text-muted-foreground">
                  AI-generated workout plans tailored to your goals and fitness level.
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <LineChart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Visualize your fitness journey with detailed progress charts.
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <Bot className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
                <p className="text-muted-foreground">
                  24/7 chatbot support for all your fitness and nutrition questions.
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <Dumbbell className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Diet Planning</h3>
                <p className="text-muted-foreground">
                  Track your nutrition and get personalized meal recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}