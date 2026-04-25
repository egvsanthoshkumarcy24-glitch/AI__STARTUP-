from services.llm_service import call_llm
from utils.parser import parse_json

def judge_agent(investor, risk, customer):

    prompt = f"""
You are a startup judge.

Inputs:
Investor: {investor}
Risk: {risk}
Customer: {customer}

Give final decision.

Return ONLY JSON:
{{
  "final_score": number,
  "verdict": "INVEST/PASS/UNCERTAIN",
  "reason": ""
}}
"""

    response = call_llm(prompt)
    return parse_json(response)