import { HfInference } from "@huggingface/inference";

// Initialize HuggingFace client with API key
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Model ID for a suitable free LLM model
const MODEL_ID = "facebook/opt-1.3b";

// System prompt to guide the model's responses
const SYSTEM_PROMPT = `You are a knowledgeable fitness assistant. Your role is to help users with:
- Exercise techniques and form
- Workout planning and routines
- Nutrition advice and meal planning
- General fitness and health guidance
Always provide accurate, helpful, and encouraging responses while staying within your expertise.
If a question is beyond your scope or could be medically sensitive, advise consulting a healthcare professional.`;

export async function getChatResponse(userMessage: string) {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nAssistant:`;
    
    const response = await hf.textGeneration({
      model: MODEL_ID,
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2,
      }
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}
