import pandas as pd
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
import pickle

# Load your dataset
# This is just a placeholder, replace it with your actual code to load the dataset
data = pd.read_csv('dataset.csv')

# Menghapus kolom yang tidak diperlukan
data = data.drop(columns=['wilayah_rohani', 'usia', 'jenis_kelamin',
                          'tinggi_badan', 'berat_badan', 'paham_pjk', 'checkup'])

konversi_angka = {
    "tidak" : 0,
    "ya": 1,
    "cukup" : 1,
    "sering": 2,
}

# Mengkodekan data kategorikal
for feature in ["nyeri_dada", "mual", "sesak_napas", "nyeri_uluhati", "hipertensi", "obesitas", "diabetes", "genetika"]:
    data[feature] = data[feature].map(konversi_angka)
    
# Mengganti nilai NaN dengan median dari setiap kolom
imputer = SimpleImputer(strategy='median')
data_imputed = pd.DataFrame(imputer.fit_transform(data), columns=data.columns)

# Save the imputer
with open('imputer.pkl', 'wb') as file:
    pickle.dump(imputer, file)

# Menstandarisasi fitur-fitur numerik
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data_imputed)

# Save the scaler
with open('scaler.pkl', 'wb') as file:
    pickle.dump(scaler, file)

# Melakukan k-means clustering
kmeans = KMeans(n_clusters=3, n_init=10, random_state=42)
kmeans.fit(data_scaled)

# Memberi nama pada setiap cluster berdasarkan karakteristiknya
nama_cluster = {
    "0": "Rendah",
    "1": "Sedang",
    "2": "Tinggi"
}

# Menambahkan label cluster ke dataset
data_imputed['cluster'] = kmeans.labels_
data_imputed['cluster'] = data_imputed['cluster'].astype(str).map(nama_cluster)

print(data_imputed)

# Save the trained model
with open('kmeans_model.pkl', 'wb') as file:
    pickle.dump(kmeans, file)