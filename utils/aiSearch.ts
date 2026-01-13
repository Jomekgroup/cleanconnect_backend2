
import { GoogleGenAI, Type } from "@google/genai";
import pool from '../config/db';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiSearchCleaners = async (query: string) => {
  try {
    const cleanersResult = await pool.query("SELECT id, full_name, services, bio, state, city FROM users WHERE role = 'cleaner' AND is_suspended = false");
    const cleanersContext = JSON.stringify(cleanersResult.rows);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is searching for: "${query}". Based on this list of cleaners: ${cleanersContext}, return a JSON array of the IDs (integers) that best match. Return ONLY the JSON array.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const matchingIds = JSON.parse(response.text || "[]");
    return matchingIds;
  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
};
