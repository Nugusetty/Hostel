import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateHostelAdvice = async (
  prompt: string,
  contextData: string
): Promise<string> => {
  if (!API_KEY) {
    return "Please configure your API Key to use the AI Assistant.";
  }

  try {
    const fullPrompt = `
      You are an expert Hostel Manager Assistant for "Hari PG Hostel".
      
      Here is the current data context of the hostel (JSON):
      ${contextData}

      User Query: ${prompt}

      Instructions:
      1. Provide helpful, professional advice or draft messages.
      2. If asked to draft a message (e.g., for rent), keep it polite but firm.
      3. If analyzing data, provide insights on occupancy or revenue.
      4. Keep responses concise and actionable.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error communicating with the AI service.";
  }
};
