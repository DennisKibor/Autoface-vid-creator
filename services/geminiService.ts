
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

// Guideline: Create a new GoogleGenAI instance right before making an API call 
// to ensure it always uses the most up-to-date API key.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScript = async (niche: string, topic: string): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a short video script for a faceless YouTube channel in the ${niche} niche about ${topic}. The script should have a catchy title, a hook (first 5 seconds), a main body (approx 60 seconds), and a clear call to action.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          cta: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "hook", "body", "cta", "description", "tags"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeMoodAndMusic = async (script: string): Promise<{ mood: string; genre: string; tempo: string }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following video script and suggest the ideal royalty-free background music mood, genre, and tempo: "${script}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood: { type: Type.STRING },
          genre: { type: Type.STRING },
          tempo: { type: Type.STRING }
        },
        required: ["mood", "genre", "tempo"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateVoiceover = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || '';
};

export const generateThumbnail = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `YouTube thumbnail for: ${prompt}. Cinematic, high resolution, no text, colorful.` }]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return '';
};

export const generateVideoClip = async (prompt: string): Promise<string> => {
  const ai = getAI();
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Faceless aesthetic video: ${prompt}. Smooth motion, cinematic high quality, professional edit.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed - no link returned");
    
    const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Veo API Error:", error);
    throw error;
  }
};
