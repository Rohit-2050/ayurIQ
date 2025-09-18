from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

GEMINI_API_KEY = "AIzaSyDJWsSTYgl8EV8VqKpZLJ7FQ21M_mWuTj4"
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

def extract_json_from_text(text):
    """
    Extract JSON object from AI text, cleaning extra markdown or text.
    """
    # Remove markdown code blocks
    text = re.sub(r"```json|```", "", text, flags=re.IGNORECASE).strip()

    # Extract first JSON object
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        json_text = text[start:end+1]
        try:
            return json.loads(json_text)
        except:
            return {"note": "Could not parse AI output as JSON.", "raw": text}
    else:
        return {"note": "No JSON found in AI output.", "raw": text}

@app.route("/analyze", methods=["POST"])
def analyze_patient():
    try:
        patient_data = request.json

        prompt = f"""
You are an expert Ayurvedic doctor. Analyze the patient strictly in JSON format with the keys:
{{
  "ayurvedic_reason": "",
  "diet": "",
  "lifestyle": "",
  "herbs": "",
  "emergency_contact": ""
}}
Patient Data: {json.dumps(patient_data)}
Respond strictly in JSON only, without any extra text or markdown.
"""

        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        headers = {"Content-Type": "application/json"}

        response = requests.post(GEMINI_ENDPOINT, headers=headers, json=payload)
        result = response.json()

        output_text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

        structured = extract_json_from_text(output_text)
        return jsonify(structured)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
