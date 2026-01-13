"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiSearchCleaners = void 0;
const genai_1 = require("@google/genai");
const db_1 = __importDefault(require("../config/db"));
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
const aiSearchCleaners = async (query) => {
    try {
        const cleanersResult = await db_1.default.query("SELECT id, full_name, services, bio, state, city FROM users WHERE role = 'cleaner' AND is_suspended = false");
        const cleanersContext = JSON.stringify(cleanersResult.rows);
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `User is searching for: "${query}". Based on this list of cleaners: ${cleanersContext}, return a JSON array of the IDs (integers) that best match. Return ONLY the JSON array.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: genai_1.Type.ARRAY,
                    items: { type: genai_1.Type.STRING }
                }
            }
        });
        const matchingIds = JSON.parse(response.text || "[]");
        return matchingIds;
    }
    catch (error) {
        console.error("AI Search Error:", error);
        return [];
    }
};
exports.aiSearchCleaners = aiSearchCleaners;
//# sourceMappingURL=aiSearch.js.map