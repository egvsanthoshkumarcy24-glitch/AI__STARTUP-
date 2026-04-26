from services.llm_service import call_llm
from utils.parser import parse_json

def master_agent(pitch_data: dict):

    problem = pitch_data.get("problem", "")
    solution = pitch_data.get("solution", "")
    audience = pitch_data.get("audience", "")
    revenue = pitch_data.get("revenue", "")
    competition = pitch_data.get("competition", "")
    
    pitch_text = f"""
    PROBLEM: {problem}
    SOLUTION: {solution}
    TARGET AUDIENCE: {audience}
    REVENUE MODEL: {revenue}
    EXISTING ALTERNATIVES/COMPETITION: {competition}
    """
    
    kill_mode = pitch_data.get("kill_mode", False)

    kill_instructions = ""
    if kill_mode:
        kill_instructions = """
KILL MODE ACTIVATED:
You are a completely ruthless, brutal startup investor (like Kevin O'Leary on Shark Tank).
You actively look for EVERY flaw, however small. You do NOT sugarcoat anything.
Your scores should be exceptionally harsh. Be mean, highly critical, and unforgiving.
Tear the idea to shreds if it deserves it.
"""

    prompt = f"""
You are a Startup Jury AI system.
{kill_instructions}

Analyze the startup from multiple perspectives:

1. Investor
2. Risk
3. Customer
4. Debate (Investor vs Risk)
5. Judge (final decision)

Startup:
{pitch_text}

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
  "market": {{
    "score": number (1-10),
    "market_size_potential": number (1-10),
    "scalability": number (1-10),
    "future_scopes": [],
    "verdict": "short sentence"
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
- CRITICAL: NEVER use double quotes inside your string values (use single quotes if needed) to avoid breaking JSON parsing.
"""

    response = call_llm(prompt)
    return parse_json(response)