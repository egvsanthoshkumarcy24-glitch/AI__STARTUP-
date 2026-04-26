import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Rocket, Lightbulb, Sparkles, Send, Loader2, AlertCircle, Skull } from 'lucide-react';
import type { EvaluationResult } from './types';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [pitch, setPitch] = useState('');
  const [killMode, setKillMode] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loadingText, setLoadingText] = useState('Initializing Jury...');

  const simulationTexts = [
    "Investor analyzing market cap...",
    "Risk computing failure probability...",
    "Customer identifying friction points...",
    "Debate protocol engaged...",
    "Judge reviewing final arguments..."
  ];

  const killModeSimulationTexts = [
    "Investor detecting BS...",
    "Risk laughing at business model...",
    "Customer deleting the app...",
    "Debate turning into a shouting match...",
    "Judge preparing the execution..."
  ];

  useEffect(() => {
    if (!isEvaluating) return;
    const texts = killMode ? killModeSimulationTexts : simulationTexts;
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, [isEvaluating, killMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) return;

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pitch, kill_mode: killMode }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate startup');
      }

      const data = await response.json();
      if (data.summary.verdict === 'ERROR') {
        throw new Error(data.summary.fatal_flaw || 'System Error');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong connecting to the Jury.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPitch('');
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 ${killMode ? 'bg-red-500/20' : 'bg-cyan-500/20'} rounded-full blur-[100px] pointer-events-none transition-colors duration-1000`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 ${killMode ? 'bg-orange-500/20' : 'bg-purple-500/20'} rounded-full blur-[100px] pointer-events-none transition-colors duration-1000`} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className={`p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-xl transition-colors duration-500 ${killMode ? 'shadow-red-900/50' : ''}`}>
              {killMode ? <Skull className="w-8 h-8 text-red-500 animate-pulse" /> : <BrainCircuit className="w-8 h-8 text-cyan-400" />}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              AI Startup <span className={killMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500' : 'text-gradient'}>Jury</span>
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Pitch your idea. Face the multi-agent tribunal. Get brutally honest feedback.
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {!isEvaluating && !result && (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 relative group">
                <div className={`absolute -inset-0.5 ${killMode ? 'bg-gradient-to-r from-red-500/50 to-orange-500/50' : 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30'} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500`}></div>
                <div className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <label htmlFor="pitch" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Lightbulb className={`w-4 h-4 ${killMode ? 'text-red-400' : 'text-yellow-400'}`} />
                      Describe your startup idea
                    </label>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${killMode ? 'text-red-400' : 'text-slate-500'}`}>Kill Mode</span>
                      <button 
                        type="button" 
                        onClick={() => setKillMode(!killMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${killMode ? 'bg-red-500 focus:ring-red-500' : 'bg-slate-600 focus:ring-cyan-500'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${killMode ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    id="pitch"
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="e.g., An AI-powered platform that automatically generates personalized bedtime stories for children based on their daily activities..."
                    className={`w-full h-48 bg-slate-900/50 border rounded-xl p-4 text-slate-200 placeholder-slate-500 transition-all resize-none mb-6 ${killMode ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-slate-700 focus:ring-cyan-500/50 focus:border-cyan-500 focus:ring-2'}`}
                    required
                  />

                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!pitch.trim()}
                    className={`w-full py-4 px-6 text-white rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed ${killMode ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-900/20' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/20'}`}
                  >
                    <span>Summon the {killMode ? 'Executioner' : 'Jury'}</span>
                    <Send className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {isEvaluating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center max-w-xl mx-auto"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className={`absolute inset-0 border-4 border-t-transparent rounded-full ${killMode ? 'border-red-500' : 'border-cyan-500'}`}
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {killMode ? <Skull className="w-8 h-8 text-red-500 animate-pulse" /> : <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6">{killMode ? 'The Executioner is Preparing...' : 'The Jury is Deliberating...'}</h3>
              
              {/* Terminal Simulation */}
              <div className="bg-black/50 border border-slate-800 rounded-lg p-4 font-mono text-sm text-left h-32 overflow-hidden flex flex-col justify-end relative shadow-inner">
                <motion.div
                  key={loadingText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 ${killMode ? 'text-red-400' : 'text-green-400'}`}
                >
                  <span className="shrink-0">{'>'}</span>
                  <span>{loadingText}</span>
                  <motion.span 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-current inline-block ml-1"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {result && !isEvaluating && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ResultsDashboard result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
