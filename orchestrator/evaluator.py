from agents.investor import investor_agent
from agents.risk import risk_agent
from agents.customer import customer_agent
from agents.judge import judge_agent
from agents.debate import debate_agent


def evaluate_startup(pitch_data: dict):

    # --- Run Agents Safely ---
    try:
        investor = investor_agent(pitch_data)
    except Exception as e:
        print("Investor Error:", e)
        investor = {"error": "Investor agent failed"}

    try:
        risk = risk_agent(pitch_data)
    except Exception as e:
        print("Risk Error:", e)
        risk = {"error": "Risk agent failed"}

    try:
        customer = customer_agent(pitch_data)
    except Exception as e:
        print("Customer Error:", e)
        customer = {"error": "Customer agent failed"}

    # --- Debate (Investor vs Risk) ---
    try:
        debate = debate_agent(investor, risk)
    except Exception as e:
        print("Debate Error:", e)
        debate = {
            "conflicts": [],
            "winner": "UNKNOWN",
            "insight": "Debate failed"
        }

    # --- Judge Decision ---
    try:
        judge = judge_agent(investor, risk, customer)
    except Exception as e:
        print("Judge Error:", e)
        judge = {
            "final_score": None,
            "verdict": "ERROR",
            "reason": "Judge agent failed"
        }

    # --- Final Structured Output ---
    return {
        "summary": {
            "final_score": judge.get("final_score"),
            "verdict": judge.get("verdict")
        },
        "details": {
            "investor": investor,
            "risk": risk,
            "customer": customer,
            "debate": debate,   # 👈 NOW INCLUDED
            "judge": judge
        }
    }