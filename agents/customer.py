from services.llm_service import call_llm
from utils.parser import parse_json

def customer_agent(pitch_data: dict):

    prompt = f"""
You are a customer.

Evaluate:
- user pain
- usefulness
- adoption issues

Input:
{pitch_data}

Return ONLY JSON:
{{
  "score": number,
  "pain_points": [],
  "objections": [],
  "verdict": ""
}}
"""

    response = call_llm(prompt)
    return parse_json(response)