export interface Summary {
  final_score: number;
  verdict: string;
  confidence: number;
  fatal_flaw: string;
  key_reason: string;
  recommendation: string;
  investment_type: string;
}

export interface Investor {
  score: number;
  strengths: string[];
  weaknesses: string[];
  verdict: string;
}

export interface Risk {
  score: number;
  risks: string[];
  verdict: string;
}

export interface Customer {
  score: number;
  pain_points: string[];
  objections: string[];
  verdict: string;
}

export interface Debate {
  conflicts: string[];
  winner: string;
  insight: string;
}

export interface Judge {
  final_score: number;
  confidence: number;
  verdict: string;
  fatal_flaw: string;
  one_line_verdict: string;
  reason: string;
  recommendation: string;
  investment_type: string;
  time_horizon: string;
  confidence_reason: string;
}

export interface EvaluationDetails {
  investor: Investor;
  risk: Risk;
  customer: Customer;
  debate: Debate;
  judge: Judge;
}

export interface EvaluationResult {
  summary: Summary;
  details: EvaluationDetails;
}
