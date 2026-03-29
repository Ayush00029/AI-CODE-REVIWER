import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/review', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Act as a senior software engineer and perform a professional code review.

Analyze the following code.

Return results ONLY in valid JSON format with the following keys:
- "issues": an array of strings detailing bugs found
- "improvedCode": a string containing the full improved code
- "explanation": a string explaining the changes and improvements
- "complexity": a string explaining the time and space complexity
- "suggestions": an array of strings detailing best practices

Code:
${code}

Language:
${language || 'auto'}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // The model might return markdown formatted JSON like ```json ... ```
      const cleanedText = text.replace(/```json\n|```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedText);
      res.json(jsonResponse);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', text);
      res.status(500).json({ error: 'Failed to parse review response from AI' });
    }

  } catch (error) {
    console.error('Error in /review:', error);
    res.status(500).json({ error: error.message || 'Internal server error while processing the review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
