import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

# Membaca dataset
data = pd.read_csv("dataset.csv")

# Menghapus kolom yang tidak diperlukan
data = data.drop(columns=['wilayah_rohani', 'usia', 'jenis_kelamin',
                          'tinggi_badan', 'berat_badan', 'paham_pjk', 'checkup'])

# Mengkodekan data kategorikal
label_encoder = LabelEncoder()
data['nyeri_dada'] = label_encoder.fit_transform(data['nyeri_dada'])
data['mual'] = label_encoder.fit_transform(data['mual'])
data['sesak_napas'] = label_encoder.fit_transform(data['sesak_napas'])
data['nyeri_uluhati'] = label_encoder.fit_transform(data['nyeri_uluhati'])
data['hipertensi'] = label_encoder.fit_transform(data['hipertensi'])
data['obesitas'] = label_encoder.fit_transform(data['obesitas'])
data['diabetes'] = label_encoder.fit_transform(data['diabetes'])
data['genetika'] = label_encoder.fit_transform(data['genetika'])

# Menstandarisasi fitur-fitur numerik
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)

# Melakukan k-means clustering
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(data_scaled)

# Memberi nama pada setiap cluster berdasarkan karakteristiknya
nama_cluster = {
    0: "Rendah",
    1: "Sedang",
    2: "Tinggi"
}

# Menambahkan label cluster ke dataset
data['cluster'] = kmeans.labels_
data['cluster'] = data['cluster'].map(nama_cluster)

# Print the resulting DataFrame to the console
print(data)