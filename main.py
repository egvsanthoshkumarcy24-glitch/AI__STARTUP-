from fastapi import FastAPI
from orchestrator.evaluator import evaluate_startup
from agents.investor import investor_agent

app = FastAPI()

@app.post("/evaluate")
def evaluate(pitch: dict):
    return evaluate_startup(pitch)

@app.get("/test")
def test():
    return investor_agent({
        "problem": "People lack fitness guidance",
        "solution": "AI fitness coach",
        "market": "global fitness",
        "revenue": "subscription"
    })