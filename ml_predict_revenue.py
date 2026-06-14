"""
Standalone revenue prediction script (no Flask needed).
Called by `php artisan ml:predict-revenue`.
Usage: python ml_predict_revenue.py <avg_price> <avg_profit> <brand> <part_type> <month> <day_of_week>
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
        return None
    with open(path, 'rb') as f:
        return pickle.load(f)

def main():
    if len(sys.argv) < 7:
        print(json.dumps({"error": "Usage: python ml_predict_revenue.py <avg_price> <avg_profit> <brand> <part_type> <month> <day_of_week>"}))
        sys.exit(1)

    avg_price = float(sys.argv[1])
    avg_profit = float(sys.argv[2])
    brand = sys.argv[3]
    part_type = sys.argv[4]
    month = int(sys.argv[5])
    day_of_week = int(sys.argv[6])

    linreg_model = load_pickle('linreg_model.pkl')
    linreg_features = load_pickle('linreg_features.pkl')

    if linreg_model is None:
        print(json.dumps({"error": "Linear Regression model not loaded"}))
        sys.exit(1)

    try:
        feature_values = []
        if linreg_features is not None:
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
                    b = f.replace('brand_', '')
                    val = 1.0 if brand.lower() == b.lower() else 0.0
                elif f.startswith('part_type_'):
                    pt = f.replace('part_type_', '')
                    val = 1.0 if part_type.lower() == pt.lower() else 0.0
                else:
                    val = float(0)
                feature_values.append(val)
        else:
            feature_values = [avg_price, 0, avg_profit]

        features = np.array([feature_values])
        prediction_log = float(linreg_model.predict(features)[0])
        predicted_revenue_php = round(np.expm1(prediction_log), 2)

        print(json.dumps({"predicted_revenue_php": predicted_revenue_php}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
