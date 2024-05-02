from pathlib import Path
# from single_version import get_version
import json

# __version__ = get_version('vietnamese_provinces', Path(__file__).parent.parent)

# Data retrieval date, in UTC
__data_version__ = '2023-05-07'

PROVINCE_JSON_PATH = Path(__file__).parent / 'data' / 'provinces.json'

def load_data():
    """Load the JSON file into a Python dictionary."""
    with open(PROVINCE_JSON_PATH, 'r', encoding='utf-8') as file:
        return json.load(file)

data_dict = load_data()

def get_provinces():
    """Return a list of provinces."""
    return [{"code": province['code'], "name": province['name']} for province in data_dict]


def get_districts(province_code):
    """Return a list of districts for a given province code."""
    province = next((p for p in data_dict if p['code'] == province_code), {})
    return [{"name": district['name'], "code": district['code']} for district in province.get('districts', [])]


def get_wards(province_code, district_code):
    """Return a list of wards for a given province and district code."""
    province = next((p for p in data_dict if p['code'] == province_code), {})
    district = next((d for d in province.get('districts', []) if d['code'] == district_code), {})
    return [{"name": ward['name'], "code": ward['code']} for ward in district.get('wards', [])]
