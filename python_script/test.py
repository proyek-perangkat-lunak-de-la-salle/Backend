from clustering import predict

# Replace this with your actual test data
test_data = {
    "nyeri_dada": "tidak",
    "mual": "tidak",
    "sesak_napas": "tidak",
    "nyeri_uluhati": "tidak",
    "hipertensi": "tidak",
    "obesitas": "tidak",
    "diabetes": "tidak",
    "genetika": "ya"
}

result = predict(test_data)

print(result)