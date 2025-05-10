import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

async function generateWriting(prompt) {
  if (!prompt) {
    return "Please provide a prompt.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    
    if (!response.text) {
      return `Error: ${error.message || 'Unknown Error'}`
    }

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return `Error: ${error.message || "Unknown error"}`;
  }
}

export default generateWriting;
