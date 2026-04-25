from services.llm_service import call_llm
from utils.parser import parse_json

def debate_agent(investor, risk):

    prompt = f"""
Investor says:
{investor}

Risk says:
{risk}

Debate:
- Investor defends the opportunity
- Risk challenges the weaknesses

Return ONLY JSON:
{{
  "conflicts": [],
  "winner": "INVESTOR/RISK",
  "insight": ""
}}
"""

    response = call_llm(prompt)
    return parse_json(response)