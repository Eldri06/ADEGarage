"""
ADEGarage ML Microservice
Loads trained .pkl models and serves predictions via a REST API.
Run: python ml_server.py
"""

import os
import pickle
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Model Loading
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_pickle(filename):
    # Existing helper – unchanged
    path = os.path.join(BASE_DIR, filename)
    if not os.path.exists(path):
        print(f"[WARNING] Model file not found: {path}")
        return None
    with open(path, 'rb') as f:
        return pickle.load(f)

# Load models at startup (once)
kmeans_model   = load_pickle('kmeans_model.pkl')
kmeans_scaler  = load_pickle('kmeans_scaler.pkl')
linreg_model   = load_pickle('linreg_model.pkl')
linreg_features = load_pickle('linreg_features.pkl')
product_rf_model = load_pickle('product_rf_model.pkl')
product_features = load_pickle('product_features.pkl')

# Cluster ID -> Human-readable tier mapping (confirmed by user from Colab)
TIER_MAP = {
    0: {'name': 'Standard',    'label': 'Standard / Niche',      'description': 'General inventory, regular sales pace'},
    1: {'name': 'Fast-Moving', 'label': 'Fast-Moving / Volume',  'description': 'High sales frequency and quantity'},
    2: {'name': 'Premium',     'label': 'Premium / High-Value',  'description': 'High-ticket items with highest price and profit'},
}

def linreg_allowed(prefix):
    if linreg_features is None:
        return []
    return [f.replace(prefix, '', 1) for f in linreg_features if f.startswith(prefix)]

def linreg_one_hot(feature_name, prefix, submitted_value, allowed_values):
    expected = feature_name.replace(prefix, '', 1)
    submitted = str(submitted_value or '').strip()
    if submitted.lower() == expected.lower():
        return 1.0
    if expected.lower() == 'other' and not any(submitted.lower() == value.lower() for value in allowed_values if value.lower() != 'other'):
        return 1.0
    return 0.0

def build_linreg_features(data, month=None, day_of_week=None):
    if linreg_features is None:
        raise ValueError('Linear Regression feature file not loaded')

    allowed_brands = linreg_allowed('brand_')
    allowed_part_types = linreg_allowed('part_type_')
    feature_values = []
    for f in linreg_features:
        if f == 'month':
            val = float(month if month is not None else data.get('month'))
        elif f == 'day_of_week':
            val = float(day_of_week if day_of_week is not None else data.get('day_of_week'))
        elif f == 'log_avg_price':
            val = np.log1p(float(data.get('avg_price', 0)))
        elif f == 'log_avg_profit':
            val = np.log1p(float(data.get('avg_profit', 0)))
        elif f.startswith('brand_'):
            val = linreg_one_hot(f, 'brand_', data.get('brand', ''), allowed_brands)
        elif f.startswith('part_type_'):
            val = linreg_one_hot(f, 'part_type_', data.get('part_type', ''), allowed_part_types)
        else:
            raise ValueError(f'Unsupported Linear Regression feature: {f}')
        feature_values.append(val)
    return np.array([feature_values])

def product_names():
    if product_features is None:
        return []
    return [f.replace('product_', '', 1) for f in product_features if f.startswith('product_')]

def exact_product_feature(product_name):
    submitted = str(product_name or '').strip()
    if product_features is None:
        return None
    for f in product_features:
        if f.startswith('product_') and f.replace('product_', '', 1) == submitted:
            return f
    return None

def build_product_features(data, product_feature, month=None, day_of_week=None):
    if product_features is None:
        raise ValueError('Random Forest feature file not loaded')

    feature_values = []
    for f in product_features:
        if f == 'month':
            val = float(month if month is not None else data.get('month'))
        elif f == 'day_of_week':
            val = float(day_of_week if day_of_week is not None else data.get('day_of_week'))
        elif f == 'avg_price':
            val = np.log1p(float(data.get('avg_price', 0)))
        elif f == 'avg_profit':
            val = np.log1p(float(data.get('avg_profit', 0)))
        elif f.startswith('product_'):
            val = 1.0 if f == product_feature else 0.0
        else:
            raise ValueError(f'Unsupported Random Forest feature: {f}')
        feature_values.append(val)
    return np.array([feature_values])

def predict_revenue_value(data, month=None, day_of_week=None):
    product_feature = exact_product_feature(data.get('product_name') or data.get('name') or data.get('product'))
    if product_feature:
        if product_rf_model is None:
            raise ValueError('Random Forest model not loaded')
        features = build_product_features(data, product_feature, month, day_of_week)
        prediction_log = float(product_rf_model.predict(features)[0])
        return round(float(np.expm1(prediction_log)), 2), 'random_forest'

    if linreg_model is None or linreg_features is None:
        raise ValueError('Linear Regression model not loaded')
    features = build_linreg_features(data, month, day_of_week)
    prediction_log = float(linreg_model.predict(features)[0])
    return round(float(np.expm1(prediction_log)), 2), 'linear_regression'

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'models': {
            'kmeans': kmeans_model is not None,
            'kmeans_scaler': kmeans_scaler is not None,
            'linreg': linreg_model is not None,
            'linreg_features': linreg_features is not None,
            'product_rf': product_rf_model is not None,
            'product_features': product_features is not None,
        }
    })


@app.route('/predict/tier', methods=['POST'])
def predict_tier():
    """
    Predict the product tier using K-Means clustering.

    Expects JSON body: { "price": 269.0, "quantity": 5, "profit": 91.99 }
    Returns:  { "cluster": 1, "tier": "Fast-Moving", "label": "Fast-Moving / Volume" }
    """
    if kmeans_model is None or kmeans_scaler is None:
        return jsonify({'error': 'K-Means model not loaded'}), 503

    data = request.get_json(force=True)

    try:
        avg_price   = float(data.get('avg_price', 0))
        avg_profit  = float(data.get('avg_profit', 0))
        total_qty   = float(data.get('total_qty', 0))
        sale_count  = float(data.get('sale_count', 0))
        unique_days = float(data.get('unique_days', 0))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid numeric values'}), 400

    # Scale features the same way training did: ["avg_price", "avg_profit", "total_qty", "sale_count", "unique_days"]
    features = np.array([[avg_price, avg_profit, total_qty, sale_count, unique_days]])
    scaled   = kmeans_scaler.transform(features)
    cluster  = int(kmeans_model.predict(scaled)[0])

    tier_info = TIER_MAP.get(cluster, {'name': 'Unknown', 'label': 'Unknown', 'description': ''})

    return jsonify({
        'cluster':     cluster,
        'tier':        tier_info['name'],
        'label':       tier_info['label'],
        'description': tier_info['description'],
    })


@app.route('/predict/tier/batch', methods=['POST'])
def predict_tier_batch():
    """
    Batch predict tiers for multiple products.

    Expects JSON body: { "products": [ { "id": 1, "price": 269, "quantity": 5, "profit": 91.99 }, ... ] }
    Returns:  { "results": [ { "id": 1, "cluster": 1, "tier": "Fast-Moving" }, ... ] }
    """
    if kmeans_model is None or kmeans_scaler is None:
        return jsonify({'error': 'K-Means model not loaded'}), 503

    data = request.get_json(force=True)
    products = data.get('products', [])

    if not products:
        return jsonify({'error': 'No products provided'}), 400

    results = []
    for product in products:
        try:
            avg_price   = float(product.get('avg_price', 0))
            avg_profit  = float(product.get('avg_profit', 0))
            total_qty   = float(product.get('total_qty', 0))
            sale_count  = float(product.get('sale_count', 0))
            unique_days = float(product.get('unique_days', 0))

            features = np.array([[avg_price, avg_profit, total_qty, sale_count, unique_days]])
            scaled   = kmeans_scaler.transform(features)
            cluster  = int(kmeans_model.predict(scaled)[0])

            tier_info = TIER_MAP.get(cluster, {'name': 'Unknown', 'label': 'Unknown', 'description': ''})

            results.append({
                'id':          product.get('id'),
                'cluster':     cluster,
                'tier':        tier_info['name'],
                'label':       tier_info['label'],
                'description': tier_info['description'],
            })
        except Exception as e:
            results.append({
                'id':    product.get('id'),
                'error': str(e),
            })

    return jsonify({'results': results})


@app.route('/predict/revenue', methods=['POST'])
def predict_revenue():
    """
    Predict daily revenue using Random Forest for exact SKUs, else Linear Regression.

    Expects JSON body: { "avg_price": 50, "avg_profit": 10, "month": 6, "day_of_week": 1, "brand": "Honda", "part_type": "Brake" }
    Returns:  { "predicted_revenue_php": 1250.50 }
    """
    data = request.get_json(force=True)

    try:
        predicted_revenue_php, model_used = predict_revenue_value(data)
        return jsonify({
            'predicted_revenue_php': predicted_revenue_php,
            'model_used': model_used,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/predict/revenue/batch', methods=['POST'])
def predict_revenue_batch():
    """
    Batch predict demand scores for multiple products.
    """
    data = request.get_json(force=True)
    products = data.get('products', [])

    if not products:
        return jsonify({'error': 'No products provided'}), 400

    results = []
    
    # Get current month and day of week for default features
    from datetime import datetime
    now = datetime.now()
    curr_month = now.month
    curr_dow = now.weekday() # 0-6 (Monday-Sunday)

    for product in products:
        try:
            predicted_revenue_php, model_used = predict_revenue_value(product, curr_month, curr_dow)

            results.append({
                'id': product.get('id'),
                'predicted_revenue_php': predicted_revenue_php,
                'model_used': model_used,
            })
        except Exception as e:
            results.append({
                'id': product.get('id'),
                'error': str(e),
                'predicted_revenue_php': 0
            })

    return jsonify({'results': results})

@app.route('/predict/revenue/metadata', methods=['GET'])
def predict_revenue_metadata():
    return jsonify({
        'brands': linreg_allowed('brand_'),
        'part_types': linreg_allowed('part_type_'),
        'products': product_names(),
        'features': linreg_features or [],
        'product_features': product_features or [],
    })


@app.route('/tiers', methods=['GET'])
def get_tiers():
    """Return the tier definitions."""
    return jsonify(TIER_MAP)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == '__main__':
    print("=" * 50)
    print("  ADEGarage ML Microservice")
    print("  Starting on http://localhost:5001")
    print("=" * 50)
    print(f"  K-Means Model:   {'Loaded' if kmeans_model else 'NOT FOUND'}")
    print(f"  K-Means Scaler:  {'Loaded' if kmeans_scaler else 'NOT FOUND'}")
    print(f"  LinReg Model:    {'Loaded' if linreg_model else 'NOT FOUND'}")
    print(f"  LinReg Features: {'Loaded' if linreg_features else 'NOT FOUND'}")
    print(f"  Product RF:      {'Loaded' if product_rf_model else 'NOT FOUND'}")
    print(f"  Product Features:{'Loaded' if product_features else 'NOT FOUND'}")
    print("=" * 50)

    app.run(host='0.0.0.0', port=5001, debug=False, use_reloader=False)
