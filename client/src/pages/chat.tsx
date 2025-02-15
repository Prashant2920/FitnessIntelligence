import { Layout } from "@/components/layout";
import { Chatbot } from "@/components/chatbot";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Bot className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">AI Fitness Assistant</h1>
            <p className="text-muted-foreground">
              Ask me anything about workouts, nutrition, or your fitness journey
            </p>
          </div>
        </div>
        <Chatbot />
      </div>
    </Layout>
  );
}