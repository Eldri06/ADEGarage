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

# Cluster ID -> Human-readable tier mapping (confirmed by user from Colab)
TIER_MAP = {
    0: {'name': 'Standard',    'label': 'Standard / Niche',      'description': 'General inventory, regular sales pace'},
    1: {'name': 'Fast-Moving', 'label': 'Fast-Moving / Volume',  'description': 'High sales frequency and quantity'},
    2: {'name': 'Premium',     'label': 'Premium / High-Value',  'description': 'High-ticket items with highest price and profit'},
}

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


@app.route('/predict/demand', methods=['POST'])
def predict_demand():
    """
    Predict demand score using Linear Regression.

    Expects JSON body with feature values matching the trained feature columns.
    Returns:  { "demand_score": 12.5 }
    """
    if linreg_model is None:
        return jsonify({'error': 'Linear Regression model not loaded'}), 503

    data = request.get_json(force=True)

    try:
        # Build feature array in the correct order
        if linreg_features is not None:
            feature_values = [float(data.get(f, 0)) for f in linreg_features]
        else:
            # Fallback: assume price, quantity, profit
            feature_values = [
                float(data.get('price', 0)),
                float(data.get('quantity', 0)),
                float(data.get('profit', 0)),
            ]

        features = np.array([feature_values])
        prediction = float(linreg_model.predict(features)[0])

        return jsonify({'demand_score': round(prediction, 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400


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
    print("=" * 50)

    app.run(host='0.0.0.0', port=5001, debug=True)
