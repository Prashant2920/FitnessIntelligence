import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import ChatPage from "@/pages/chat";
import { WorkoutPlanComponent } from "@/components/workout-plan";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <ProtectedRoute path="/workouts" component={WorkoutPlanComponent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;