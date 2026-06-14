"""
Standalone revenue prediction script (no Flask needed).
Called by `php artisan ml:predict-revenue`.
Usage:
  python ml_predict_revenue.py --metadata
  python ml_predict_revenue.py <avg_price> <avg_profit> <brand> <part_type> <month> <day_of_week> [product_name]
Output: JSON with predicted_revenue_php
"""
import sys
import json
import os
import pickle
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_pickle(filename):
    path = os.path.join(BASE_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Required Linear Regression file not found: {filename}")
    with open(path, 'rb') as f:
        return pickle.load(f)

def revenue_metadata(linreg_features, product_features):
    brands = [f.replace('brand_', '', 1) for f in linreg_features if f.startswith('brand_')]
    part_types = [f.replace('part_type_', '', 1) for f in linreg_features if f.startswith('part_type_')]
    products = [f.replace('product_', '', 1) for f in product_features if f.startswith('product_')]
    return {
        "features": linreg_features,
        "product_features": product_features,
        "brands": brands,
        "part_types": part_types,
        "products": products,
        "numeric_features": ["month", "day_of_week", "log_avg_price", "log_avg_profit"],
    }

def one_hot_value(feature_name, prefix, submitted_value, allowed_values):
    expected = feature_name.replace(prefix, '', 1)
    submitted = str(submitted_value or '').strip()
    if submitted.lower() == expected.lower():
        return 1.0
    if expected.lower() == 'other' and not any(submitted.lower() == value.lower() for value in allowed_values if value.lower() != 'other'):
        return 1.0
    return 0.0

def exact_product_feature(product_name, product_features):
    submitted = str(product_name or '').strip()
    for f in product_features:
        if f.startswith('product_') and f.replace('product_', '', 1) == submitted:
            return f
    return None

def build_product_features(product_features, product_feature, avg_price, avg_profit, month, day_of_week):
    values = []
    for f in product_features:
        if f == 'month':
            val = float(month)
        elif f == 'day_of_week':
            val = float(day_of_week)
        elif f == 'avg_price':
            val = float(avg_price)
        elif f == 'avg_profit':
            val = float(avg_profit)
        elif f.startswith('product_'):
            val = 1.0 if f == product_feature else 0.0
        else:
            raise ValueError(f"Unsupported Random Forest feature: {f}")
        values.append(val)
    return np.array([values])

def build_linreg_features(linreg_features, avg_price, avg_profit, brand, part_type, month, day_of_week):
    allowed_brands = [f.replace('brand_', '', 1) for f in linreg_features if f.startswith('brand_')]
    allowed_part_types = [f.replace('part_type_', '', 1) for f in linreg_features if f.startswith('part_type_')]
    values = []
    for f in linreg_features:
        if f == 'month':
            val = float(month)
        elif f == 'day_of_week':
            val = float(day_of_week)
        elif f == 'log_avg_price':
            val = np.log1p(avg_price)
        elif f == 'log_avg_profit':
            val = np.log1p(avg_profit)
        elif f.startswith('brand_'):
            val = one_hot_value(f, 'brand_', brand, allowed_brands)
        elif f.startswith('part_type_'):
            val = one_hot_value(f, 'part_type_', part_type, allowed_part_types)
        else:
            raise ValueError(f"Unsupported Linear Regression feature: {f}")
        values.append(val)
    return np.array([values])

def main():
    try:
        linreg_features = list(load_pickle('linreg_features.pkl'))
        product_features = list(load_pickle('product_features.pkl'))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

    if len(sys.argv) == 2 and sys.argv[1] == '--metadata':
        print(json.dumps(revenue_metadata(linreg_features, product_features)))
        return

    try:
        linreg_model = load_pickle('linreg_model.pkl')
        product_model = load_pickle('product_rf_model.pkl')
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

    avg_price = None
    avg_profit = None
    brand = ''
    part_type = ''
    month = 1
    day_of_week = 0
    product_name = ''

    if len(sys.argv) >= 2 and sys.argv[1] == '--stdin':
        try:
            data = json.loads(sys.stdin.read())
            avg_price = float(data.get('avg_price', 0))
            avg_profit = float(data.get('avg_profit', 0))
            brand = data.get('brand', '')
            part_type = data.get('part_type', '')
            month = int(data.get('month', 1))
            day_of_week = int(data.get('day_of_week', 0))
            product_name = data.get('product_name', '')
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            print(json.dumps({"error": f"Invalid JSON input: {e}"}))
            sys.exit(1)
    elif len(sys.argv) >= 3 and sys.argv[1] == '--json-file':
        try:
            with open(sys.argv[2], 'r') as f:
                data = json.load(f)
            avg_price = float(data.get('avg_price', 0))
            avg_profit = float(data.get('avg_profit', 0))
            brand = data.get('brand', '')
            part_type = data.get('part_type', '')
            month = int(data.get('month', 1))
            day_of_week = int(data.get('day_of_week', 0))
            product_name = data.get('product_name', '')
        except (json.JSONDecodeError, KeyError, TypeError, OSError) as e:
            print(json.dumps({"error": f"Invalid JSON input: {e}"}))
            sys.exit(1)
    elif len(sys.argv) >= 3 and sys.argv[1] == '--json':
        try:
            data = json.loads(sys.argv[2])
            avg_price = float(data.get('avg_price', 0))
            avg_profit = float(data.get('avg_profit', 0))
            brand = data.get('brand', '')
            part_type = data.get('part_type', '')
            month = int(data.get('month', 1))
            day_of_week = int(data.get('day_of_week', 0))
            product_name = data.get('product_name', '')
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            print(json.dumps({"error": f"Invalid JSON input: {e}"}))
            sys.exit(1)
    elif len(sys.argv) >= 7:
        avg_price = float(sys.argv[1])
        avg_profit = float(sys.argv[2])
        brand = sys.argv[3]
        part_type = sys.argv[4]
        month = int(sys.argv[5])
        day_of_week = int(sys.argv[6])
        product_name = sys.argv[7] if len(sys.argv) >= 8 else ''
    else:
        print(json.dumps({"error": "Usage: python ml_predict_revenue.py --stdin | --json-file <path> | --json <str> | positional args"}))
        sys.exit(1)

    if avg_price is None:
        print(json.dumps({"error": "avg_price is required"}))
        sys.exit(1)

    try:
        product_feature = exact_product_feature(product_name, product_features)
        if product_feature:
            features = build_product_features(product_features, product_feature, avg_price, avg_profit, month, day_of_week)
            prediction_log = float(product_model.predict(features)[0])
            model_used = 'random_forest'
        else:
            features = build_linreg_features(linreg_features, avg_price, avg_profit, brand, part_type, month, day_of_week)
            prediction_log = float(linreg_model.predict(features)[0])
            model_used = 'linear_regression'

        predicted_revenue_php = round(np.expm1(prediction_log), 2)

        print(json.dumps({
            "predicted_revenue_php": predicted_revenue_php,
            "model_used": model_used,
            "matched_product": product_name if product_feature else None,
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
