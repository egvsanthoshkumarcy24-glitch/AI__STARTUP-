import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Lightbulb, Send, AlertCircle, Skull, TrendingUp, ShieldAlert, Users, Swords, Gavel, CheckCircle2 } from 'lucide-react';
import type { EvaluationResult, PitchData } from './types';
import ResultsDashboard from './components/ResultsDashboard';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const questions = [
  {
    id: 'problem',
    label: 'What problem are you solving?',
    placeholder: 'e.g., Small business owners spend 10+ hours a week on manual bookkeeping...',
    icon: Users,
    agent: 'Customer Agent',
    description: 'We need to know if this is a real pain point or just a minor inconvenience.'
  },
  {
    id: 'solution',
    label: 'How does your solution solve this better?',
    placeholder: 'e.g., Our AI automates 90% of data entry and categorizes expenses in real-time...',
    icon: TrendingUp,
    agent: 'Investor Agent',
    description: 'Explain your "unfair advantage" and why your approach is superior to existing ones.'
  },
  {
    id: 'audience',
    label: 'Who exactly has this problem?',
    placeholder: 'e.g., Independent contractors and businesses with 1-5 employees in the US...',
    icon: Users,
    agent: 'Customer Agent',
    description: 'Be specific about your beachhead market. "Everyone" is not an answer.'
  },
  {
    id: 'revenue',
    label: 'How do you make money?',
    placeholder: 'e.g., SaaS subscription starting at $29/mo per user...',
    icon: TrendingUp,
    agent: 'Investor Agent',
    description: 'Show us the unit economics. Is this a sustainable business or a charity?'
  },
  {
    id: 'competition',
    label: 'How is this solved today?',
    placeholder: 'e.g., Manual Excel sheets or expensive enterprise software like Oracle...',
    icon: ShieldAlert,
    agent: 'Risk Analyst',
    description: 'If it\'s not a problem today, why will they pay for your solution tomorrow?'
  }
];

const agentSteps = [
  {
    id: 'investor',
    title: 'Investor Agent',
    subtitle: 'Analyzing market potential & scalability',
    description: 'Evaluating revenue models, TAM, competitive moats, and growth trajectory...',
    icon: TrendingUp,
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-500',
    glow: 'bg-emerald-500/30',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    tasks: ['Market size assessment', 'Revenue model viability', 'Competitive advantage', 'Scalability potential'],
  },
  {
    id: 'risk',
    title: 'Risk Analyst',
    subtitle: 'Computing failure probability',
    description: 'Stress-testing the idea against market volatility, execution risk, and regulatory hurdles...',
    icon: ShieldAlert,
    color: 'amber',
    gradient: 'from-amber-600 to-orange-500',
    glow: 'bg-amber-500/30',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    tasks: ['Market risk analysis', 'Execution risk scoring', 'Regulatory landscape', 'Financial burn rate'],
  },
  {
    id: 'customer',
    title: 'Customer Agent',
    subtitle: 'Identifying friction & delight points',
    description: 'Simulating real user behavior, pain points, and willingness to pay...',
    icon: Users,
    color: 'cyan',
    gradient: 'from-cyan-600 to-blue-500',
    glow: 'bg-cyan-500/30',
    borderColor: 'border-cyan-500/40',
    textColor: 'text-cyan-400',
    tasks: ['Pain point validation', 'User journey mapping', 'Willingness to pay', 'Retention prediction'],
  },
  {
    id: 'debate',
    title: 'Debate Protocol',
    subtitle: 'Agents clashing perspectives',
    description: 'Investor optimism vs Risk pessimism — resolving conflicting viewpoints...',
    icon: Swords,
    color: 'purple',
    gradient: 'from-purple-600 to-violet-500',
    glow: 'bg-purple-500/30',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-400',
    tasks: ['Cross-examining findings', 'Resolving contradictions', 'Weighing trade-offs', 'Building consensus'],
  },
  {
    id: 'judge',
    title: 'The Judge',
    subtitle: 'Rendering final verdict',
    description: 'Synthesizing all arguments into a decisive, final evaluation...',
    icon: Gavel,
    color: 'rose',
    gradient: 'from-rose-600 to-pink-500',
    glow: 'bg-rose-500/30',
    borderColor: 'border-rose-500/40',
    textColor: 'text-rose-400',
    tasks: ['Aggregating scores', 'Identifying fatal flaws', 'Final score calculation', 'Verdict delivery'],
  },
];

const killModeSteps = [
  {
    ...agentSteps[0],
    title: 'Investor Executioner',
    subtitle: 'Sniffing out BS in your pitch',
    description: 'Ruthlessly tearing apart your revenue fantasy and market delusion...',
    tasks: ['Destroying your TAM claims', 'Exposing revenue holes', 'Mocking your "moat"', 'Laughing at projections'],
  },
  {
    ...agentSteps[1],
    title: 'Death Calculator',
    subtitle: 'Computing your startup funeral date',
    description: 'Calculating exactly how and when your startup will crash and burn...',
    tasks: ['Estimating death spiral', 'Measuring burn velocity', 'Counting red flags', 'Predicting shutdown date'],
  },
  {
    ...agentSteps[2],
    title: 'Anti-Customer',
    subtitle: 'Already deleting your app',
    description: 'Simulating the user who downloads, tries once, and never comes back...',
    tasks: ['Finding every UX flaw', 'Listing why users leave', 'Rating annoyance factor', 'Calculating churn doom'],
  },
  {
    ...agentSteps[3],
    title: 'Shouting Match',
    subtitle: 'Agents arguing who hates it more',
    description: 'A brutal cage match between agents fighting over who found the worst flaws...',
    tasks: ['Weaponizing feedback', 'Escalating criticism', 'Amplifying weaknesses', 'No mercy debate'],
  },
  {
    ...agentSteps[4],
    title: 'The Executioner',
    subtitle: 'Preparing the final blow',
    description: 'Gathering all evidence for the most devastating verdict possible...',
    tasks: ['Sharpening the axe', 'Writing the eulogy', 'Sealing the fate', 'Delivering the kill shot'],
  },
];

function App() {
  const [pitchData, setPitchData] = useState<PitchData>({
    problem: '',
    solution: '',
    audience: '',
    revenue: '',
    competition: ''
  });
  const [inputStep, setInputStep] = useState(0);
  const [killMode, setKillMode] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [taskProgress, setTaskProgress] = useState(0);

  const steps = killMode ? killModeSteps : agentSteps;

  useEffect(() => {
    if (!isEvaluating) {
      setCurrentStep(0);
      setTaskProgress(0);
      return;
    }

    // Cycle through tasks within a step
    const taskInterval = setInterval(() => {
      setTaskProgress(prev => {
        if (prev >= steps[currentStep]?.tasks.length - 1) return prev;
        return prev + 1;
      });
    }, 800);

    // Cycle through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) return prev; // stay on last step
        setTaskProgress(0);
        return prev + 1;
      });
    }, 4000);

    return () => {
      clearInterval(taskInterval);
      clearInterval(stepInterval);
    };
  }, [isEvaluating, currentStep, killMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(pitchData).some(v => !v.trim())) return;

    setIsEvaluating(true);
    setError(null);
    setCurrentStep(0);
    setTaskProgress(0);

    try {
      const response = await fetch('http://localhost:8000/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...pitchData, kill_mode: killMode }),
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
    setPitchData({
      problem: '',
      solution: '',
      audience: '',
      revenue: '',
      competition: ''
    });
    setInputStep(0);
  };

  const nextStep = () => {
    if (inputStep < questions.length - 1) {
      setInputStep(inputStep + 1);
    }
  };

  const prevStep = () => {
    if (inputStep > 0) {
      setInputStep(inputStep - 1);
    }
  };

  const currentQuestion = questions[inputStep];
  const QuestionIcon = currentQuestion.icon;
  const isLastInputStep = inputStep === questions.length - 1;
  const isFirstInputStep = inputStep === 0;
  const isCurrentInputComplete = pitchData[currentQuestion.id as keyof PitchData].trim().length > 10;

  const activeStep = steps[currentStep] || steps[0];
  const StepIcon = activeStep.icon;
  const overallProgress = ((currentStep) / steps.length) * 100 + ((taskProgress + 1) / (activeStep.tasks.length * steps.length)) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ======== INPUT SCREEN ======== */}
        {!isEvaluating && !result && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative"
          >
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

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto"
              >
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                  <div className="glass-panel p-6 sm:p-10 relative group overflow-hidden">
                    <div className={`absolute -inset-0.5 ${killMode ? 'bg-gradient-to-r from-red-500/50 to-orange-500/50' : 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30'} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500`}></div>
                    
                    <div className="relative">
                      {/* Form Header */}
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${killMode ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                            <QuestionIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-0.5">
                              {currentQuestion.agent} asks:
                            </span>
                            <h3 className="text-xl font-bold text-white">Step {inputStep + 1} of {questions.length}</h3>
                          </div>
                        </div>

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

                      {/* Question Content */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={inputStep}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div>
                            <label htmlFor={currentQuestion.id} className="text-2xl font-bold text-white block mb-2 leading-tight">
                              {currentQuestion.label}
                            </label>
                            <p className="text-slate-400 text-sm mb-6">{currentQuestion.description}</p>
                            
                            <textarea
                              id={currentQuestion.id}
                              value={pitchData[currentQuestion.id as keyof PitchData]}
                              onChange={(e) => setPitchData({ ...pitchData, [currentQuestion.id]: e.target.value })}
                              placeholder={currentQuestion.placeholder}
                              autoFocus
                              className={`w-full h-40 bg-slate-900/50 border rounded-xl p-5 text-lg text-slate-200 placeholder-slate-600 transition-all resize-none ${killMode ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-slate-700 focus:ring-cyan-500/50 focus:border-cyan-500 focus:ring-2'}`}
                            />
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {error && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <p className="text-sm">{error}</p>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex gap-4 mt-8">
                        {!isFirstInputStep && (
                          <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-4 rounded-xl font-bold text-slate-400 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
                          >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                          </button>
                        )}
                        
                        {!isLastInputStep ? (
                          <button
                            type="button"
                            onClick={nextStep}
                            disabled={!isCurrentInputComplete}
                            className={`flex-1 py-4 px-6 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-30 disabled:cursor-not-allowed ${killMode ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-red-900/20' : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-900/20'}`}
                          >
                            Next Question
                            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={!isCurrentInputComplete}
                            className={`flex-1 py-4 px-6 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-30 disabled:cursor-not-allowed ${killMode ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-red-900/20' : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-900/20'}`}
                          >
                            <span>Summon the {killMode ? 'Executioner' : 'Jury'}</span>
                            <Send className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar at the bottom of the form */}
                  <div className="mt-8 flex gap-2">
                    {questions.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          i < inputStep ? (killMode ? 'bg-red-500' : 'bg-cyan-500') : 
                          i === inputStep ? (killMode ? 'bg-red-500/40 animate-pulse' : 'bg-cyan-500/40 animate-pulse') : 
                          'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ======== FULL-SCREEN AGENT LOADING SCREENS ======== */}
        {isEvaluating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 relative"
          >
            {/* Dynamic background that changes with each agent */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className={`absolute top-[20%] left-[15%] w-[500px] h-[500px] ${activeStep.glow} rounded-full blur-[150px]`} />
                <div className={`absolute bottom-[10%] right-[15%] w-[400px] h-[400px] ${activeStep.glow} rounded-full blur-[120px] opacity-50`} />
              </motion.div>
            </AnimatePresence>

            {/* Overall Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900">
              <motion.div
                className={`h-full bg-gradient-to-r ${activeStep.gradient}`}
                animate={{ width: `${Math.min(overallProgress, 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Step Indicators */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      scale: i === currentStep ? 1.2 : 1,
                      opacity: i <= currentStep ? 1 : 0.3,
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                      i < currentStep
                        ? 'bg-emerald-500/20 border-emerald-500'
                        : i === currentStep
                        ? `${activeStep.borderColor} bg-slate-800`
                        : 'border-slate-700 bg-slate-800/50'
                    }`}
                  >
                    {i < currentStep ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <step.icon className={`w-5 h-5 ${i === currentStep ? activeStep.textColor : 'text-slate-600'}`} />
                    )}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-0.5 rounded-full transition-colors duration-500 ${i < currentStep ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Main Content - Agent Card */}
            <div className="relative z-10 max-w-lg w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-center"
                >
                  {/* Large Animated Icon */}
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    {/* Outer ring pulse */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full border-2 ${activeStep.borderColor}`}
                    />
                    {/* Spinning ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className={`absolute inset-2 rounded-full border-2 border-t-transparent ${activeStep.borderColor}`}
                    />
                    {/* Inner solid bg */}
                    <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${activeStep.gradient} flex items-center justify-center shadow-2xl`}>
                      <StepIcon className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Step Number */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 ${activeStep.textColor} bg-slate-800/80 border ${activeStep.borderColor}`}
                  >
                    Step {currentStep + 1} of {steps.length}
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-extrabold text-white mb-3 tracking-tight"
                  >
                    {activeStep.title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`text-lg font-medium ${activeStep.textColor} mb-4`}
                  >
                    {activeStep.subtitle}
                  </motion.p>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed"
                  >
                    {activeStep.description}
                  </motion.p>

                  {/* Task checklist */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`bg-slate-900/60 backdrop-blur-sm border ${activeStep.borderColor} rounded-2xl p-6 text-left`}
                  >
                    <div className="space-y-3">
                      {activeStep.tasks.map((task, i) => (
                        <motion.div
                          key={task}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: i <= taskProgress ? 1 : 0.3,
                            x: 0,
                          }}
                          transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                            i < taskProgress
                              ? 'bg-emerald-500/20 border border-emerald-500'
                              : i === taskProgress
                              ? `bg-gradient-to-r ${activeStep.gradient} shadow-lg`
                              : 'bg-slate-800 border border-slate-700'
                          }`}>
                            {i < taskProgress ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : i === taskProgress ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-slate-600" />
                            )}
                          </div>
                          <span className={`text-sm font-medium transition-colors duration-300 ${
                            i < taskProgress ? 'text-emerald-400 line-through opacity-60' : i === taskProgress ? 'text-white' : 'text-slate-600'
                          }`}>
                            {task}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pitch reminder at bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-md w-full px-4"
            >
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Evaluating</p>
                <p className="text-sm text-slate-400 truncate italic">
                  "{pitchData.problem.substring(0, 50)}..."
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ======== RESULTS SCREEN ======== */}
        {result && !isEvaluating && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative"
          >
            <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none`} />
            <div className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none`} />

            <div className="max-w-6xl mx-auto relative z-10">
              <header className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
                    <BrainCircuit className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    AI Startup <span className="text-gradient">Jury</span>
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
              <ResultsDashboard result={result} pitch={JSON.stringify(pitchData)} onReset={handleReset} />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;
