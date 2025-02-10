import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  isUser: boolean;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([{
    content: "Hello! I'm your AI fitness assistant. How can I help you today?",
    isUser: false
  }]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chat", { message });
      const data = await res.json();
      if (res.status !== 200) {
        throw new Error(data.error || "Failed to send message");
      }
      return data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { content: data.message, isUser: false }]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { content: input, isUser: true }]);
    sendMessageMutation.mutate(input);
    setInput("");
  };

  return (
    <Card className="h-[calc(100vh-8rem)] md:h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Fitness Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] md:max-w-[80%] rounded-lg p-3
                    ${message.isUser 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                    }
                  `}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 animate-pulse">
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about workouts, nutrition, or fitness..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={sendMessageMutation.isPending}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}