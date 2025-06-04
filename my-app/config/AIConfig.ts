import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "summarize this text: Buddy was no ordinary dog. With his golden fur shimmering under the morning sun, he bounded through the meadow, ears flopping with each joyful leap. His tail wagged like a metronome set to happiness, and his nose twitched as he sniffed out the hidden scents of the world.  \n\nEvery morning, he waited by the door, eyes gleaming with excitement, knowing that his best friend, Lily, would soon wake up and take him on an adventure. Whether it was chasing butterflies, rolling in the grass, or simply lying by her side as she read, Buddy lived for these moments.  \n\nHe wasn’t just a pet—he was family. Through stormy nights, when thunder rumbled like an angry beast, he curled up beside Lily, offering her warmth and comfort. And in return, she gave him endless love, belly rubs, and treats that tasted like heaven.  \n\nTo Buddy, life was simple: run, play, love, and always, always stay by Lily’s side.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Buddy, a golden-furred dog filled with boundless joy, lived for his adventures with his best friend, Lily. More than just a pet, he was family, offering comfort and receiving endless love in return. His simple life revolved around running, playing, loving, and always being by Lily's side.\n",
        },
      ],
    },
  ],
});