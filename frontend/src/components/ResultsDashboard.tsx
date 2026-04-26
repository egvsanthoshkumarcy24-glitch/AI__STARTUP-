import React from 'react';
import { motion } from 'framer-motion';
import type { EvaluationResult } from '../types';
import { 
  Gavel, TrendingUp, AlertTriangle, Users, Swords, 
  RotateCcw, ShieldAlert, Target, Zap, CheckCircle2, XCircle, Info
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import _CountUp from 'react-countup';
const CountUp = (_CountUp as any).default || _CountUp;

interface Props {
  result: EvaluationResult;
  onReset: () => void;
}

const safeArray = (arr: any) => {
  if (Array.isArray(arr)) return arr;
  if (typeof arr === 'string') return [arr];
  return [];
};

const safeScore = (score: any) => {
  const num = parseFloat(score);
  return isNaN(num) ? 0 : num;
};

const StatBar = ({ score, colorClass, bgClass }: { score: number, colorClass: string, bgClass: string }) => {
  const percentage = Math.min(Math.max((score / 10) * 100, 0), 100);
  return (
    <div className="w-full mt-2 mb-4">
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score</span>
        <span className={`font-black text-2xl ${colorClass} drop-shadow-md`}>
          <CountUp end={score} duration={2} decimals={score % 1 !== 0 ? 1 : 0} />
          <span className="text-sm text-slate-500 font-medium">/10</span>
        </span>
      </div>
      <div className="h-3.5 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className={`h-full ${bgClass} rounded-full relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  );
};

const ResultsDashboard: React.FC<Props> = ({ result, onReset }) => {
  const { summary, details } = result;

  const getVerdictColor = (verdict: string) => {
    if (typeof verdict !== 'string') return 'text-amber-400 bg-amber-400/10';
    if (verdict.toUpperCase().includes('PASS') || verdict.toUpperCase().includes('NO')) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (verdict.toUpperCase().includes('INVEST') || verdict.toUpperCase().includes('YES')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-amber-400';
    return 'text-red-400';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const finalScore = safeScore(summary.final_score);
  const investorScore = safeScore(details.investor?.score);
  const riskScore = safeScore(details.risk?.score);
  const customerScore = safeScore(details.customer?.score);
  const confScore = safeScore(summary.confidence);

  const radarData = [
    { subject: 'Investor', A: investorScore, fullMark: 10 },
    { subject: 'Risk', A: riskScore, fullMark: 10 },
    { subject: 'Customer', A: customerScore, fullMark: 10 },
    { subject: 'Final', A: finalScore, fullMark: 10 },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* 1. Final Verdict Card (Judge) */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-blue-500/50 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative glass-panel p-8 sm:p-10 border border-slate-600/50">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Gavel className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold">Final Verdict</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-2xl font-medium leading-tight text-white">
                  "{details.judge?.one_line_verdict || 'No verdict provided.'}"
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`px-4 py-2 rounded-full border text-sm font-bold tracking-wider ${getVerdictColor(summary.verdict || '')}`}>
                    {summary.verdict || 'UNKNOWN'}
                  </span>
                  <span className="px-4 py-2 rounded-full border border-slate-700 bg-slate-800 text-slate-300 text-sm font-medium">
                    {summary.investment_type || 'UNKNOWN RISK'}
                  </span>
                  <span className="px-4 py-2 rounded-full border border-slate-700 bg-slate-800 text-slate-300 text-sm font-medium flex items-center gap-1 group relative cursor-help">
                    <Target className="w-4 h-4" />
                    Confidence: <CountUp end={confScore} duration={2} />/10
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs font-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                      <div className="flex items-start gap-2 text-slate-300">
                        <Info className="w-4 h-4 shrink-0 text-cyan-400" />
                        <span>{details.judge?.confidence_reason || 'N/A'}</span>
                      </div>
                    </div>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Reason</h4>
                  <p className="text-slate-300">{summary.key_reason || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Time Horizon</h4>
                  <p className="text-slate-300">{details.judge?.time_horizon || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Upside if Fixed</h4>
                  <p className="text-slate-300">{details.judge?.upside_if_fixed || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Why Not Zero?</h4>
                  <p className="text-slate-300">{details.judge?.why_not_zero || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-3xl border border-slate-700 min-w-[200px] gap-4">
              <div className="text-center">
                <span className="text-6xl font-black mb-2 tracking-tighter" style={{ color: getScoreColor(finalScore).replace('text-', '') }}>
                  <span className={getScoreColor(finalScore)}>
                    <CountUp end={finalScore} duration={2.5} />
                  </span>
                  <span className="text-3xl text-slate-600">/10</span>
                </span>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-2">Final Score</div>
              </div>
              
              <div className="w-[200px] h-[200px] -mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} isAnimationActive={true} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-red-500 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-bold text-red-100">Fatal Flaw</h3>
          </div>
          <p className="text-red-200/80 leading-relaxed">
            {summary.fatal_flaw || 'None specified.'}
          </p>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-blue-500 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-bold text-blue-100">Recommendation</h3>
          </div>
          <p className="text-blue-200/80 leading-relaxed">
            {summary.recommendation || 'None specified.'}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col h-full card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">Investor</h3>
          </div>
          
          <StatBar score={investorScore} colorClass={getScoreColor(investorScore)} bgClass="bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
          
          <p className="text-sm italic text-slate-300 mb-6 flex-grow bg-slate-900/40 p-4 rounded-lg border border-slate-700/50 shadow-inner">
            "{details.investor?.verdict || 'N/A'}"
          </p>
          
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4"/> Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {safeArray(details.investor?.strengths).map((item, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                    className="text-xs font-medium text-emerald-100 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-md shadow-sm hover:bg-emerald-500/20 transition-colors">
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4"/> Weaknesses
              </h4>
              <div className="flex flex-wrap gap-2">
                {safeArray(details.investor?.weaknesses).map((item, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                    className="text-xs font-medium text-red-100 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-md shadow-sm hover:bg-red-500/20 transition-colors">
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col h-full card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">Risk</h3>
          </div>
          
          <StatBar score={riskScore} colorClass={getScoreColor(riskScore)} bgClass="bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          
          <p className="text-sm italic text-slate-300 mb-6 flex-grow bg-slate-900/40 p-4 rounded-lg border border-slate-700/50 shadow-inner">
            "{details.risk?.verdict || 'N/A'}"
          </p>
          
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4"/> Key Risks
            </h4>
            <div className="flex flex-col gap-2">
              {safeArray(details.risk?.risks).map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                  className="text-sm text-amber-100 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 shadow-sm hover:bg-amber-500/20 transition-colors flex items-start gap-2">
                  <span className="shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_#fbbf24]"></span>
                  <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col h-full card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">Customer</h3>
          </div>
          
          <StatBar score={customerScore} colorClass={getScoreColor(customerScore)} bgClass="bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          
          <p className="text-sm italic text-slate-300 mb-6 flex-grow bg-slate-900/40 p-4 rounded-lg border border-slate-700/50 shadow-inner">
            "{details.customer?.verdict || 'N/A'}"
          </p>
          
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4"/> Pain Points Solved
              </h4>
              <div className="flex flex-wrap gap-2">
                {safeArray(details.customer?.pain_points).map((item, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}
                    className="text-xs font-medium text-cyan-100 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-md shadow-sm hover:bg-cyan-500/20 transition-colors">
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Target className="w-4 h-4"/> Objections
              </h4>
              <div className="flex flex-wrap gap-2">
                {safeArray(details.customer?.objections).map((item, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}
                    className="text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-md shadow-sm hover:bg-slate-700 transition-colors">
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <motion.div variants={itemVariants} className="glass-panel overflow-hidden">
        <div className="p-6 bg-slate-800/80 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Swords className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold">Debate Insights</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Winner:</span>
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-md text-sm font-bold tracking-wider">
              {details.debate?.winner || 'UNKNOWN'}
            </span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Core Conflicts</h4>
            <ul className="space-y-3">
              {safeArray(details.debate?.conflicts).map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300">
                  <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-purple-500"></span>
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50 relative">
              <div className="absolute top-0 left-6 -translate-y-1/2 px-2 bg-slate-900 text-xs font-semibold text-purple-400 tracking-wider">KEY INSIGHT</div>
              <p className="text-slate-200 text-lg leading-relaxed italic">
                "{details.debate?.insight || 'N/A'}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-600 hover:bg-slate-800 hover:border-slate-500 transition-colors text-slate-300 font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Evaluate Another Idea
        </button>
      </motion.div>

    </motion.div>
  );
};

export default ResultsDashboard;
