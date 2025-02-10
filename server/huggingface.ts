import { HfInference } from "@huggingface/inference";

// Initialize HuggingFace client with API key
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Using a smaller, more reliable model for text generation
const MODEL_ID = "TinyLlama/TinyLlama-1.1B-Chat-v1.0";

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
    const prompt = `<|system|>${SYSTEM_PROMPT}</s>
<|user|>${userMessage}</s>
<|assistant|>`;

    const response = await hf.textGeneration({
      model: MODEL_ID,
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2,
        do_sample: true,
        num_return_sequences: 1,
        stop: ["</s>", "<|user|>", "<|system|>"]
      }
    });

    // Clean up the response
    let cleanedResponse = response.generated_text
      .replace(prompt, '')
      .trim()
      .replace(/<\|assistant\|>/g, '')
      .replace(/<\|user\|>/g, '')
      .replace(/<\|system\|>/g, '')
      .replace(/<\/s>/g, '')
      .trim();

    // If response is empty, provide a fallback
    if (!cleanedResponse) {
      cleanedResponse = "I apologize, but I'm having trouble processing your request. Could you please rephrase your question?";
    }

    return cleanedResponse;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}