from fastapi import FastAPI
from orchestrator.evaluator import evaluate_startup

app = FastAPI()

@app.post("/evaluate")
def evaluate(pitch: dict):
    return evaluate_startup(pitch)