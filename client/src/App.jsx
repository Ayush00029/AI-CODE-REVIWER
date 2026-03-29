import { useState } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { Loader2, Play, Code2, AlertTriangle, Lightbulb, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [code, setCode] = useState('// Paste your code here\n');
  const [language, setLanguage] = useState('javascript');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [error, setError] = useState(null);

  const renderString = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return String(val);
  };

  const SafeMarkdown = ({ content }) => {
    const text = renderString(content).replace(/\0/g, '');
    if (!text || text.trim() === '') return null;
    return (
      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  };

  const handleReview = async () => {
    if (!code.trim()) {
      setError('Please provide some code to review.');
      return;
    }

    setError(null);
    setIsReviewing(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/review`, {
        code,
        language
      });
      console.log('Received response from backend:', response.data);
      setReviewResult(response.data);
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.error || err.message;
      setError(`Failed to get review: ${backendError}`);
    } finally {
      setIsReviewing(false);
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Code2 className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            AI Code Reviewer
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/20">Beta</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-colors group cursor-pointer hover:bg-slate-700"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          <button
            onClick={handleReview}
            disabled={isReviewing}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-600/20"
          >
            {isReviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Review Code
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]">

        {/* Left Side: Editor */}
        <div className="flex flex-col border-r border-slate-800/50 relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
            }}
            className="flex-1"
          />
        </div>

        {/* Right Side: Results */}
        <div className="flex flex-col h-full overflow-y-auto bg-slate-900/30 custom-scrollbar">
          {error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full text-slate-400">
              <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
              <p className="text-rose-400">{error}</p>
            </div>
          ) : !reviewResult && !isReviewing ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full text-slate-500">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Code2 className="w-8 h-8 text-indigo-400/50" />
              </div>
              <h2 className="text-xl font-medium text-slate-300 mb-2">Ready to review</h2>
              <p className="max-w-xs text-sm">Paste your code on the left and click "Review Code" to get AI-powered insights.</p>
            </div>
          ) : isReviewing ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-indigo-400 animate-pulse font-medium">Analyzing your code...</p>
              <p className="text-xs text-slate-500 mt-2">Checking for bugs, complexity, and optimizations</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Issues/Bugs */}
              {Array.isArray(reviewResult?.issues) && reviewResult.issues.length > 0 && (
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-rose-500/10 bg-rose-500/5">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <h3 className="font-semibold text-rose-300">Potential Issues Found</h3>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-3">
                      {reviewResult.issues.map((issue, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                          <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-rose-500"></span>
                          <SafeMarkdown content={issue} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Suggestions / Best Practices */}
              {Array.isArray(reviewResult?.suggestions) && reviewResult.suggestions.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-amber-500/10 bg-amber-500/5">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-amber-300">Best Practices & Suggestions</h3>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-3">
                      {reviewResult.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                          <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-amber-500"></span>
                          <SafeMarkdown content={suggestion} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Time Complexity */}
              {reviewResult?.complexity && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-emerald-500/10 bg-emerald-500/5">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-emerald-300">Complexity Analysis</h3>
                  </div>
                  <div className="p-5 text-sm text-slate-300">
                    <SafeMarkdown content={reviewResult.complexity} />
                  </div>
                </div>
              )}

              {/* Explanation */}
              {reviewResult?.explanation && (
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-indigo-500/10 bg-indigo-500/5">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-semibold text-indigo-300">Explanation</h3>
                  </div>
                  <div className="p-5 text-sm text-slate-300">
                    <SafeMarkdown content={reviewResult.explanation} />
                  </div>
                </div>
              )}

              {/* Improved Code */}
              {reviewResult?.improvedCode && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700/50 bg-slate-800/80">
                    <CheckCircle2 className="w-5 h-5 text-slate-300" />
                    <h3 className="font-semibold text-slate-200">Improved Code</h3>
                  </div>
                  <div className="p-5">
                    <div className="rounded-lg overflow-hidden border border-slate-700">
                      <Editor
                        height="400px"
                        language={language}
                        theme="vs-dark"
                        value={renderString(reviewResult.improvedCode)}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          padding: { top: 16 },
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
