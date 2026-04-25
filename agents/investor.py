from services.llm_service import call_llm
from utils.parser import parse_json

def investor_agent(pitch_data: dict):

    prompt = f"""
You are an investor.

Evaluate:
- market
- scalability
- risks

Input:
{pitch_data}

Return ONLY JSON:
{{
  "score": number,
  "strengths": [],
  "weaknesses": [],
  "risks": [],
  "verdict": "INVEST/PASS/UNCERTAIN"
}}
"""

    response = call_llm(prompt)
    return parse_json(response)