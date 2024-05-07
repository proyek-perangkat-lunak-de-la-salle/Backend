from flask import Flask, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the model
with open('./utils/kmeans_model.pkl', 'rb') as file:
    model = pickle.load(file)

# Load the imputer and scaler
with open('./utils/imputer.pkl', 'rb') as file:
    imputer = pickle.load(file)

with open('./utils/scaler.pkl', 'rb') as file:
    scaler = pickle.load(file)

@app.route('/predict', methods=['GET'])
def predict():
    # Hardcoded data
    data = {
        "nyeri_dada": "tidak",
        "mual": "tidak",
        "sesak_napas": "tidak",
        "nyeri_uluhati": "tidak",
        "hipertensi": "ya",
        "obesitas": "tidak",
        "diabetes": "tidak",
        "genetika": "ya"
    }

    # Make a DataFrame from the hardcoded data
    data_df = pd.DataFrame(data, index=[0])

    # Preprocess the data
    konversi_angka = {
        "tidak" : 0,
        "ya": 1,
        "cukup" : 1,
        "sering": 2,
    }

    for feature in ["nyeri_dada", "mual", "sesak_napas", "nyeri_uluhati", "hipertensi", "obesitas", "diabetes", "genetika"]:
        data_df[feature] = data_df[feature].map(konversi_angka)

    data_imputed = pd.DataFrame(imputer.transform(data_df), columns=data_df.columns)
    data_scaled = scaler.transform(data_imputed)

    # Make prediction using the model
    prediction = model.predict(data_scaled)

    # Convert the prediction to the cluster name
    nama_cluster = {
        "0": "Rendah",
        "1": "Sedang",
        "2": "Tinggi"
    }
    prediction = nama_cluster[str(prediction[0])]

    # Return the prediction
    return jsonify(prediction)

if __name__ == '__main__':
    app.run(port=5000, debug=True)