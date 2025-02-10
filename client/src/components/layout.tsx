import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  User,
  Dumbbell,
  Apple,
  LineChart,
  MessageSquare,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">FitAI</h1>
        <p className="text-sm text-muted-foreground">Welcome, {user?.username}</p>
      </div>

      <nav className="space-y-2">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Link href="/workouts">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
            <Dumbbell className="mr-2 h-4 w-4" />
            Workouts
          </Button>
        </Link>
        <Link href="/diet">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
            <Apple className="mr-2 h-4 w-4" />
            Diet
          </Button>
        </Link>
        <Link href="/progress">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
            <LineChart className="mr-2 h-4 w-4" />
            Progress
          </Button>
        </Link>
        <Link href="/chat">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setOpen(false)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
        </Link>
      </nav>

      <div className="mt-auto pt-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive"
          onClick={() => {
            logoutMutation.mutate();
            setOpen(false);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-border">
        <ScrollArea className="h-screen py-6 px-4">
          <NavContent />
        </ScrollArea>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">FitAI</h1>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <ScrollArea className="h-full py-6 px-4">
                <NavContent />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6 overflow-auto md:ml-0 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}