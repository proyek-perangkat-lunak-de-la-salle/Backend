from flask import Flask, request, jsonify
from flask_cors import CORS
from clustering import predict as clustering_predict

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)  # Log the received data
        

        result = clustering_predict(data)
        print("Prediction result:", result)  # Log the prediction result

        return jsonify(result)
    except Exception as e:
        print("Error occurred:", e)  # Log any exceptions
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)