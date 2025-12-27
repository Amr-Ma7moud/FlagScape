from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
# Enable CORS for all routes to allow requests from the frontend
CORS(app)

# Load data
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'countries.json')

def get_countries_data():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/v3.1/all', methods=['GET'])
def get_all_countries():
    countries = get_countries_data()
    
    # Handle ?fields=name,capital,etc query param
    fields_param = request.args.get('fields')
    if fields_param:
        fields = fields_param.split(',')
        filtered_countries = []
        for country in countries:
            filtered_country = {}
            for field in fields:
                # Handle nested fields if necessary, but the public API structure 
                # usually returns the top level keys provided.
                # However, some fields in the public API are nested. 
                # For simplicity here, we assume top-level keys match or we traverse if needed.
                # Actually, the public API returns the full object structure for the requested keys.
                if field in country:
                    filtered_country[field] = country[field]
            filtered_countries.append(filtered_country)
        return jsonify(filtered_countries)
        
    return jsonify(countries)

@app.route('/v3.1/name/<name>', methods=['GET'])
def get_country_by_name(name):
    countries = get_countries_data()
    # Implicitly case-insensitive search to match public API behavior loosely
    # Public API allows partial matches or full text.
    # We will implement a simple filter.
    
    # Check for fullText=true param
    full_text = request.args.get('fullText') == 'true'
    
    matches = []
    target_name = name.lower()
    
    for country in countries:
        common_name = country.get('name', {}).get('common', '').lower()
        official_name = country.get('name', {}).get('official', '').lower()
        
        if full_text:
            if target_name == common_name or target_name == official_name:
                matches.append(country)
        else:
            if target_name in common_name or target_name in official_name:
                matches.append(country)
                
    if not matches:
        return jsonify({'status': 404, 'message': 'Not Found'}), 404
        
    return jsonify(matches)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
