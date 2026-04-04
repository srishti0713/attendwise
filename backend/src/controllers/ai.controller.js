import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

export const extractTimetable = async (req,res) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const base64ImageFile = fs.readFileSync("timetable.png", {
        encoding: "base64",
    });

    const prompt = `Extract the subjects from this timetable into the following JSON format.
IMPORTANT: Include only days and subject short-codes.
Omit all empty ("X") slots and omit all timings.
Only output the following as:
{
  "days": {
    "Monday": ["AD2", "CSW2"],
    "Tuesday": ["AD2", "CSW2"]
  }
}`;

    const contents = [
        {
            inlineData: {
                mimeType: "image/png",
                data: base64ImageFile,
            },
        },
        { text: prompt },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
            responseMimeType: "application/json",
        },
        contents: contents,
    });

    console.log(response.text);
};
