import pandas as pd
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Read the dataset
data = pd.read_csv("dataset.csv")

# Remove unnecessary columns
data = data.drop(columns=['wilayah_rohani', 'usia', 'jenis_kelamin',
                          'tinggi_badan', 'berat_badan', 'paham_pjk', 'checkup'])

# Define the mapping for categorical data
konversi_angka = {
    "tidak" : 0,
    "cukup" : 1,
    "sering": 2,
    "ya" : 3,
}

# Encode categorical data
for feature in ["nyeri_dada", "mual", "sesak_napas", "nyeri_uluhati", "hipertensi", "obesitas", "diabetes", "genetika"]:
    data[feature] = data[feature].map(konversi_angka)
    
# Replace NaN values with the median of each column
imputer = SimpleImputer(strategy='median')
data_imputed = pd.DataFrame(imputer.fit_transform(data), columns=data.columns)

# Standardize the numeric features
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data_imputed)

# Perform k-means clustering with 3 clusters
kmeans = KMeans(n_clusters=3, n_init=10, random_state=42)
kmeans.fit(data_scaled)

# Assign cluster labels based on the predefined conditions
cluster_labels = {
    0: "Low",
    1: "Medium",
    2: "High"
}
data_imputed['cluster'] = pd.Series(kmeans.labels_).map(cluster_labels)

# Split the data into training and testing sets (70/30 split)
X_train, X_test, y_train, y_test = train_test_split(data_scaled, data_imputed['cluster'], test_size=0.3, random_state=42)

# Train the K-means model on the training data
kmeans_train = KMeans(n_clusters=3, n_init=10, random_state=42)
kmeans_train.fit(X_train)

# Predict the cluster labels for the test data
y_pred = kmeans_train.predict(X_test)

# Map the predicted cluster labels to the original cluster names
y_pred = pd.Series(y_pred).map(cluster_labels)

# Calculate the accuracy of the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
