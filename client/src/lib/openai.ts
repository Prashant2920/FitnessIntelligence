import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateWorkoutPlan(userProfile: any) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Create a personalized workout plan. Return a JSON object with exercises, sets, and reps."
      },
      {
        role: "user",
        content: JSON.stringify(userProfile)
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}

export async function getChatbotResponse(message: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a knowledgeable fitness assistant. Provide concise, helpful answers about exercise, nutrition, and health."
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  return response.choices[0].message.content;
}
