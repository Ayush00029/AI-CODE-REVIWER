import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const models = data.models.map(m => m.name);
    fs.writeFileSync('models.json', JSON.stringify(models, null, 2), 'utf-8');
    console.log("Wrote models.json");
  } catch (e) {
    console.error("Error fetching models", e);
  }
}

listModels();
