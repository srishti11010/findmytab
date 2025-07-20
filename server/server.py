from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import numpy as np

app = Flask(__name__)

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def get_embedding(text):
    if isinstance(text, list):
        return model.encode(text)
    return model.encode([text])[0]

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@app.route("/search", methods=["POST"])
def search():
    data = request.json
    query = data["query"]
    tabs = data["tabs"]
    print(data)

    query_embedding = query_embedding = get_embedding("Represent this sentence for searching relevant passages: " + query)

    tab_embeddings = get_embedding(tabs)

    similarities = [cosine_similarity(query_embedding, tab) for tab in tab_embeddings]
    best_index = int(np.argmax(similarities))

    return jsonify({"bestIndex": best_index})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
