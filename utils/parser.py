import json
import re

def parse_json(response: str):
    try:
        json_str = re.search(r"\{.*\}", response, re.DOTALL).group()
        return json.loads(json_str)
    except:
        print("RAW RESPONSE:", response)
        raise ValueError("Invalid JSON")