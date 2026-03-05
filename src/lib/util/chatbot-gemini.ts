'use server'

import { GoogleGenAI } from "@google/genai";

export default async function geminiChatbot(text: string) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });


    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
            parts: [
                {
                    text: text,

                }
            ]
        }],
        config: {
            systemInstruction: 'You are a helpful assistant',
            responseMimeType: "text/plain",

        }
    });
    console.log(response.text);
    return response.text
}

