import axios, { AxiosError } from "axios";

const DEEPSEEK_LOCAL_URL = "http://127.0.0.1:11434/api/chat"; // Correct API path

export const deepseekChat = async (message: string): Promise<string> => {
  try {
    console.log("🔄 Sending request to DeepSeek...");

    const payload = {
      model: "deepseek-r1:1.5b", // Ensure this matches your model name
      messages: [{ role: "user", content: message }],
    };

    console.log("📤 Payload:", payload);

    const response = await axios.post(DEEPSEEK_LOCAL_URL, payload, {
      headers: { "Content-Type": "application/json" },
      responseType: "stream", // ✅ Handle streamed response
      timeout: 10000,
    });

    let fullResponse = "";

    return new Promise<string>((resolve) => {
      response.data.on("data", (chunk: Buffer) => {
        try {
          const parsedData = JSON.parse(chunk.toString());
          if (parsedData.message?.content) {
            fullResponse += parsedData.message.content;
          }
        } catch (err) {
          console.warn("⚠️ Could not parse chunk:", chunk.toString());
        }
      });

      response.data.on("end", () => {
        console.log("✅ Full Response:", fullResponse.trim());
        resolve(fullResponse.trim() || "No response from DeepSeek.");
      });
    });
  } catch (err: unknown) {
    const error = err as AxiosError;
    console.error("❌ DeepSeek Local API Error:", error);

    if (error.response) {
      return `API Error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      return "No response from DeepSeek. Check if the server is running.";
    } else {
      return `Unexpected error: ${error.message}`;
    }
  }
};
