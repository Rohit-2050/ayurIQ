from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
import json, requests, re, os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)  # allow all origins

# --- Home route ---
@app.route("/")
def home():
    return render_template("index.html")

# --- MySQL connection ---
db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT", 3306)),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    ssl_ca="ca.pem"
)

cursor = db.cursor()

# --- Tables creation ---
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS food (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(100),
    category VARCHAR(100),
    cuisine_region VARCHAR(100),
    is_veg BOOLEAN,
    calories_per_100g INT
)
""")
db.commit()

# --- Remaining routes like /register, /login, /foods, /analyze, etc. ---
# (keep the rest of your code as is)


# --- Auth Routes ---
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not username or not email or not password or not role:
        return jsonify({"error": "All fields are required"}), 400

    try:
        sql = "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)"
        values = (username, email, password, role)
        cursor.execute(sql, values)
        db.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    sql = "SELECT role FROM users WHERE email=%s AND password=%s"
    cursor.execute(sql, (email, password))
    result = cursor.fetchone()

    if result:
        return jsonify({"message": "Login successful!", "role": result[0]}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


# --- Foods Route ---
@app.route('/foods', methods=['GET'])
def get_foods():
    food_cursor = db.cursor(dictionary=True)
    food_cursor.execute("SELECT * FROM foods")  
    foods = food_cursor.fetchall()
    food_cursor.close()
    return jsonify(foods), 200



# --- AI Route ---
gemini_key = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={gemini_key}"

def extract_json_from_text(text):
    """Extract JSON from AI text output."""
    text = re.sub(r"```json|```", "", text, flags=re.IGNORECASE).strip()
    start, end = text.find("{"), text.rfind("}")
    if start != -1 and end != -1:
        try:
            return json.loads(text[start:end+1])
        except:
            return {"note": "Could not parse AI output", "raw": text}
    return {"note": "No JSON found", "raw": text}

@app.route("/analyze", methods=["POST"])
def analyze_patient():
    try:
        # Safely parse incoming JSON
        patient_data = request.get_json(force=True, silent=True)
        if not patient_data:
            return jsonify({"error": "No JSON found in request"}), 400

        print("Incoming patient data:", patient_data)  # debug

        # Prepare prompt for AI
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
Respond strictly in JSON only.
"""
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        headers = {"Content-Type": "application/json"}

        # Call AI
        response = requests.post(GEMINI_ENDPOINT, headers=headers, json=payload)
        result = response.json()
        output_text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

        print("AI raw output:", output_text)  # debug

        # Extract JSON from AI output
        return jsonify(extract_json_from_text(output_text))

    except Exception as e:
        return jsonify({"error": str(e)}), 500 
    
# --- Disease → Dosha Mapping ---
disease_dosha_map = {
    "Hair Fall": {"Vata": "High", "Pitta": "High", "Kapha": "Low"},
    "Digestive disorder": {"Vata": "High", "Pitta": "High", "Kapha": "High"},
    "Skin problem": {"Vata": "High", "Pitta": "High", "Kapha": "Low"},
    "Diabetes": {"Vata": "Low", "Pitta": "Normal", "Kapha": "High"},
    "Obesity": {"Vata": "Low", "Pitta": "Normal", "Kapha": "High"},
    "Hyper Tension": {"Vata": "High", "Pitta": "High", "Kapha": "Low"},
    "Arthritis": {"Vata": "High", "Pitta": "Moderate", "Kapha": "Low"},
    "Respiratory problem": {"Vata": "High", "Pitta": "Moderate", "Kapha": "High"},
    "PCOS /PCOD": {"Vata": "High", "Pitta": "Moderate", "Kapha": "High"},
    "Stress / Anxiety": {"Vata": "High", "Pitta": "Moderate", "Kapha": "Low"},
    "Liver Disorder": {"Vata": "Moderate", "Pitta": "High", "Kapha": "Low"},
}

    
@app.route("/generate_diet", methods=["POST"])
def generate_diet():
    data = request.get_json()
    disease = data.get("disease")

    if disease not in disease_dosha_map:
        return jsonify({"error": "Disease not found"}), 400

    dosha_needs = disease_dosha_map[disease]
    food_cursor = db.cursor(dictionary=True)

    query = """
    SELECT food_name, rasa, cuisine_region, dosha_effect 
    FROM foods 
    WHERE dosha_effect LIKE %s OR dosha_effect LIKE %s OR dosha_effect LIKE %s
    LIMIT 15
    """
    like_patterns = [f"%Pacifies {d}%" for d in dosha_needs if dosha_needs[d] in ["High", "Moderate"]]

    while len(like_patterns) < 3:
        like_patterns.append("%")

    food_cursor.execute(query, like_patterns[:3])
    foods = food_cursor.fetchall()
    food_cursor.close()

    return jsonify({
        "disease": disease,
        "dosha_needs": dosha_needs,
        "recommended_foods": foods
    })

    
# --- Diseases API ---
@app.route("/diseases", methods=["GET"])
def get_diseases():
    return jsonify(list(disease_dosha_map.keys()))

# --- Patients API (stub; later can come from DB) ---
@app.route("/patients", methods=["GET"])
def get_patients():
    return jsonify([
        {"id": 1, "name": "Rahul Kumar", "vikriti": "Pitta", "disease": "Diabetes"},
        {"id": 2, "name": "Aishwarya Reddy", "vikriti": "Vata", "disease": "Hypertension"},
        {"id": 3, "name": "Karthik Raj", "vikriti": "Kapha", "disease": "Arthritis"},
        {"id": 4, "name": "Priya Menon", "vikriti": "Pitta", "disease": "PCOS /PCOD"},
        {"id": 5, "name": "Vikram Nair", "vikriti": "Vata", "disease": "Hair Fall"},
        {"id": 6, "name": "Sneha Iyer", "vikriti": "Kapha", "disease": "Obesity"},
        {"id": 7, "name": "Arjun Rao", "vikriti": "Pitta", "disease": "Liver Disorder"},
        {"id": 8, "name": "Divya Shankar", "vikriti": "Vata", "disease": "Digestive disorder"},
        {"id": 9, "name": "Madhav Ranganathan", "vikriti": "Kapha", "disease": "Respiratory problem"},
        {"id": 10, "name": "Anjali Subramanian", "vikriti": "Pitta", "disease": "Skin problem"},
        {"id": 11, "name": "Siddharth Krishnan", "vikriti": "Vata", "disease": "Stress / Anxiety"}
    ])


@app.route("/foodsRecomm", methods=["POST"])
def get_foods_recomm():
    data = request.get_json()
    disease = data.get("disease")

    if not disease or disease not in disease_dosha_map:
        return jsonify({"error": "Disease not found"}), 400

    dosha_needs = disease_dosha_map[disease]

    # Build LIKE patterns for High/Moderate doshas
    like_patterns = [f"%Pacifies {d}%" for d in dosha_needs if dosha_needs[d] in ["High", "Moderate"]]
    while len(like_patterns) < 3:
        like_patterns.append("%")  # fill remaining slots if less than 3

    food_cursor = db.cursor(dictionary=True)

    # Query: select matching foods, randomized, across all cuisines
    query = """
    SELECT food_id, food_name, category, cuisine_region, is_veg, calories_per_100g, 
           protein_per_100g, carbs_per_100g, fat_per_100g, rasa, guna, virya, vipaka, 
           dosha_effect, digestibility, recommended_for_conditions, meal_type
    FROM foods
    WHERE dosha_effect LIKE %s OR dosha_effect LIKE %s OR dosha_effect LIKE %s
    ORDER BY RAND()
    LIMIT 15
    """

    food_cursor.execute(query, like_patterns[:3])
    foods = food_cursor.fetchall()
    food_cursor.close()

    return jsonify({
        "disease": disease,
        "dosha_needs": dosha_needs,
        "recommended_foods": foods
    }), 200





if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
