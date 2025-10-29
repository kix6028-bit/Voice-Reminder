import { GoogleGenAI, Modality } from "@google/genai";
import { decode, decodeAudioData } from '../utils/audioUtils.ts';

let outputAudioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
    if (!outputAudioContext) {
        outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return outputAudioContext;
};

export const generateAndPlaySpeech = async (text: string): Promise<void> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: text,
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (base64Audio) {
            const audioContext = getAudioContext();
            if (audioContext.state === 'suspended') {
                 await audioContext.resume();
            }
            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                audioContext,
                24000,
                1
            );
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();

            return new Promise((resolve) => {
                source.onended = () => resolve();
            });

        } else {
            console.error("TTS API response did not contain audio data:", JSON.stringify(response, null, 2));
            throw new Error("No audio data received from API.");
        }

    } catch (error) {
        console.error("Error in generateAndPlaySpeech:", error);
        throw error;
    }
};