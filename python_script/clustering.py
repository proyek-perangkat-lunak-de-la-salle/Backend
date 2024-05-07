import pandas as pd
import pickle
import sys
import json
import os

def predict(data_dict):
    # Convert the Python object into a pandas DataFrame
    data = pd.DataFrame(data_dict, index=[0])

    # Encode categorical data
    konversi_angka = {
        "tidak": 0,
        "cukup": 1,
        "sering": 2,
        "ya": 1,
    }

    for feature in ["nyeri_dada", "mual", "sesak_napas", "nyeri_uluhati", "hipertensi", "obesitas", "diabetes", "genetika"]:
        data[feature] = data[feature].map(konversi_angka)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Load the imputer and scaler
    with open(os.path.join(script_dir, 'imputer.pkl'), 'rb') as file:
        imputer = pickle.load(file)

    with open(os.path.join(script_dir, 'scaler.pkl'), 'rb') as file:
        scaler = pickle.load(file)

    # Replace NaN values with the median of each column
    data_imputed = pd.DataFrame(imputer.transform(data), columns=data.columns)

    # Standardize the numeric features
    data_scaled = scaler.transform(data_imputed)

    # Load the trained KMeans model  
    with open(os.path.join(script_dir, 'kmeans_model.pkl'), 'rb') as file:
        kmeans = pickle.load(file)

    # Assign cluster names
    nama_cluster = {
        0: "Rendah",
        1: "Sedang",
        2: "Tinggi"
    }

    # Get the cluster label for the single sample
    cluster_label = kmeans.predict(data_scaled)[0]
    cluster_name = nama_cluster[cluster_label]

    # Convert the results to JSON
    results_json = {"cluster": cluster_name}

    return results_json


if __name__ == "__main__":
    # Get the JSON string from the command-line arguments
    data_json = sys.argv[1]

    # Convert the JSON string back into a Python object
    data_dict = json.loads(data_json)

    # Predict the cluster
    results_json = predict(data_dict)

    # Print the results as a JSON string to stdout
    print(json.dumps(results_json))
