from agents.master_agent import master_agent

def evaluate_startup(pitch_data: dict):

    try:
        result = master_agent(pitch_data)
    except Exception as e:
        print("Master Agent Error:", e)
        return {
            "summary": {
                "final_score": None,
                "verdict": "ERROR",
                "confidence": None,
                "fatal_flaw": "System failure",
                "recommendation": None,
                "investment_type": None
            },
            "details": {}
        }

    judge = result.get("judge", {})

    return {
        "summary": {
            "final_score": judge.get("final_score"),
            "verdict": judge.get("verdict"),
            "confidence": judge.get("confidence"),
            "fatal_flaw": judge.get("fatal_flaw"),
            "key_reason": judge.get("reason"),
            "recommendation": judge.get("recommendation"),
            "investment_type": judge.get("investment_type")
        },
        "details": result
    }