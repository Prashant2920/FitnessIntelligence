import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  User,
  Dumbbell,
  Apple,
  LineChart,
  MessageSquare,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border">
        <ScrollArea className="h-screen py-6 px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">FitAI</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.username}</p>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/workouts">
              <Button variant="ghost" className="w-full justify-start">
                <Dumbbell className="mr-2 h-4 w-4" />
                Workouts
              </Button>
            </Link>
            <Link href="/diet">
              <Button variant="ghost" className="w-full justify-start">
                <Apple className="mr-2 h-4 w-4" />
                Diet
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="ghost" className="w-full justify-start">
                <LineChart className="mr-2 h-4 w-4" />
                Progress
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </Link>
          </nav>

          <div className="mt-auto pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
