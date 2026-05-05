import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";

class AIService {
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }

    readImageAsBase64(filePath) {
        return fs.readFileSync(filePath, {
            encoding: "base64",
        });
    }

    async generateFromImage({ base64Image, mimeType, prompt }) {
        const contents = [
            {
                inlineData: {
                    mimeType,
                    data: base64Image,
                },
            },
            { text: prompt },
        ];

        const response = await this.ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            generationConfig: {
                responseMimeType: "application/json",
            },
            contents,
        });

        return response.text;
    }

    parseJSON(text) {
        try {
            const cleaned = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            return JSON.parse(cleaned);
        } catch (error) {
            throw new Error("AI returned invalid JSON");
        }
    }

    async extractTimetableFromImage(filePath, mimeType) {
        const base64Image = this.readImageAsBase64(filePath);

        const prompt = `
Extract the weekly timetable from the TABLE GRID ONLY in this image.

STRICT RULES:
- Look ONLY at the main timetable grid (the rows for each day vs time slots)
- IGNORE any text below the table (subject legends, course codes, teacher names)
- IGNORE empty slots marked as "X"
- IGNORE time slot headers
- Keep lab subjects together (e.g., "DMW ALB", "GM LAB") — do NOT split them
- Return ONLY the subject short code — strip ANY room/location info in parentheses
- "AD2 (CL-501)" → "AD2", "COA LAB (E-310)" → "COA LAB"
- If a subject appears in multiple slots on the same day, include it multiple times (e.g., ["ALA", "ALA"] means ALA has 2 slots that day)

Return ONLY this JSON, no explanation:
{
  "days": {
    "Monday": ["DMW ALB", "GM LAB"],
    "Tuesday": ["CRYPTO", "DMW", "GM", "MISE"],
    "Wednesday": ["DMW", "CRYPTO", "MISE", "OT"],
    "Thursday": ["MISE", "OT", "CRYPTO", "GM"],
    "Friday": ["GM", "MISE", "OT", "DMW"],
    "Saturday": ["OT"]
  }
}
`;

        const raw = await this.generateFromImage({
            base64Image,
            mimeType,
            prompt,
        });

        const parsed = this.parseJSON(raw);

        return {
            raw,
            parsed,
        };
    }
}

const aiService = new AIService();

export default aiService;
