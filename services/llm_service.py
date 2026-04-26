from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def call_llm(prompt: str):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        print("\n===== LLM RESPONSE =====\n")
        print(response.text)
        print("\n========================\n")

        return response.text

    except Exception as e:
        print("❌ LLM ERROR:", e)
        raise e