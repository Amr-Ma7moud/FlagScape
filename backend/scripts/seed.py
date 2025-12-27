import requests
import json
import os

def seed_data():
    regions = ['africa', 'americas', 'asia', 'europe', 'oceania', 'antarctic']
    all_countries = []
    
    headers = {
        'User-Agent': 'FlagScape/1.0 (Educational Project)'
    }
    
    for region in regions:
        # fields = "name,flags,capital,region,subregion,population,area,languages,currencies,latlng,borders,cca3,coatOfArms"
        # url = f"https://restcountries.com/v3.1/region/{region}?fields={fields}"
        # Let's try without fields first to match the successful 'name' query, adding fields later if needed or if response is too big.
        # But 'all' failed even without fields. Let's try simple region fetch.
        url = f"https://restcountries.com/v3.1/region/{region}"
        print(f"Fetching data for region: {region}...")
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 404:
                print(f"Region {region} not found (might be Antarctic). Skipping.")
                continue
                
            response.raise_for_status()
            data = response.json()
            all_countries.extend(data)
            print(f"Fetched {len(data)} countries for {region}.")
            
        except Exception as e:
            print(f"Error fetching region {region}: {e}")
            
    # Remove duplicates just in case (cca3 as key)
    unique_countries = {c.get('cca3'): c for c in all_countries if c.get('cca3')}
    final_list = list(unique_countries.values())

    # If list is empty, try a fallback?
    if not final_list:
        print("No countries fetched. Trying backup endpoint or failing.")
        return

    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, 'countries.json')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully saved {len(final_list)} countries to {output_path}")

if __name__ == "__main__":
    seed_data()
