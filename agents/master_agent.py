from services.llm_service import call_llm
from utils.parser import parse_json

def master_agent(pitch_data: dict):

    prompt = f"""
You are a Startup Jury AI system.

Analyze the startup from multiple perspectives:

1. Investor
2. Risk
3. Customer
4. Debate (Investor vs Risk)
5. Judge (final decision)

Startup:
{pitch_data}

Return ONLY JSON:

{{
  "investor": {{
    "score": number (1-10),
    "strengths": [],
    "weaknesses": [],
    "verdict": "short sentence"
  }},
  "risk": {{
    "score": number (1-10),
    "risks": [],
    "verdict": "short sentence"
  }},
  "customer": {{
    "score": number (1-10),
    "pain_points": [],
    "objections": [],
    "verdict": "short sentence"
  }},
  "debate": {{
    "conflicts": [],
    "winner": "INVESTOR/RISK",
    "insight": "short sentence"
  }},
  "judge": {{
  "final_score": number (1-10),
  "confidence": number (1-10),
  "verdict": "INVEST/PASS/UNCERTAIN",
  "fatal_flaw": "biggest weakness",
  "one_line_verdict": "single powerful sentence",
  "reason": "max 15 words",
  "recommendation": "what to do instead",
  "investment_type": "HIGH RISK / LOW RETURN / STRONG BET",
  "time_horizon": "expected growth timeline",
  "confidence_reason": "why confidence is high/low",
  "upside_if_fixed": "what could work if improved",
  "why_not_zero": "why score is not zero"
}}
}}

Rules:
- All scores MUST be between 1 and 10
- Keep all text SHORT and sharp
- one_line_verdict must be impactful and concise
- reason must be under 15 words
- Judge must consider all previous sections
- Return ONLY JSON (no markdown, no explanation)
"""

    response = call_llm(prompt)
    return parse_json(response)