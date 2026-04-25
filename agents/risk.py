from services.llm_service import call_llm
from utils.parser import parse_json

def risk_agent(pitch_data: dict):

    prompt = f"""
You are a risk auditor.

Identify:
- financial risks
- market risks
- execution risks

Input:
{pitch_data}

Return ONLY JSON:
{{
  "score": number,
  "risks": [],
  "verdict": "HIGH/MEDIUM/LOW"
}}
"""

    response = call_llm(prompt)
    return parse_json(response)