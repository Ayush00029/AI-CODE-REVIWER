# AI Code Reviewer

A complete production-ready web application where users paste code and an AI reviews it. Powered by Google's Gemini AI, this application detects bugs, suggests improvements, explains complexity, and returns improved code.

## 🚀 Features

* **Advanced Code Editor:** Features Monaco Editor with syntax highlighting for multiple languages.
* **AI Code Review:** Get instant, professional code reviews powered by `gemini-1.5-flash`.
* **Structured Output:** Results are broken down into Bugs found, Best Practices, Time Complexity, Explanations, and Improved Code.
* **Responsive Layout:** Beautiful, modern glassmorphism UI built with Tailwind CSS.

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS
* Monaco Editor (`@monaco-editor/react`)
* Lucide React (Icons)
* Axios

**Backend:**
* Node.js & Express.js
* Google Generative AI SDK (`@google/generative-ai`)

## 📦 Setup Instructions

### 1. Clone the repository and install dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-code-reviewer

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables (Gemini API Setup)

You need a valid Google Gemini API Key. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

1. Navigate to the `/server` directory.
2. Create a `.env` file based on the provided configuration.
3. Add your Gemini API Key:

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

### 3. Run the Application

Start both the backend and frontend development servers.

**Terminal 1 (Backend):**
```bash
cd server
npm start
```
The backend will run on `http://localhost:5000`.

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`. Open this URL in your browser.

## 🌐 Deployment Guide

### Frontend Deployment (Vercel)
1. Push your code to GitHub.
2. Go to Vercel and create a new project.
3. Import the repository.
4. Set the Root Directory to `client`.
5. The build command (`npm run build`) and output directory (`dist`) will be automatically detected by Vite.
6. Make sure to update the backend URL in `App.jsx` to point to your deployed backend.

### Backend Deployment (Render / Railway)
1. Go to Render or Railway and create a new Web Service.
2. Connect your GitHub repository.
3. Set the Root Directory to `server` (or configure the start command to `cd server && node index.js`).
4. Set the Start Command to `node index.js`.
5. Add your `GEMINI_API_KEY` to the Environment Variables.
6. Deploy!

## 📸 Screenshots

*(Add screenshots of your application here)*
