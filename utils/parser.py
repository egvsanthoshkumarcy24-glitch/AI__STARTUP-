import json

def parse_json(response: str):
    try:
        start = response.find("{")
        end = response.rfind("}") + 1
        json_str = response[start:end]
        return json.loads(json_str)
    except Exception as e:
        print("PARSER ERROR:", e)
        print("RAW RESPONSE:", response)
        raise e