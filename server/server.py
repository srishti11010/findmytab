from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import os
import numpy as np

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)

def get_embedding(text, model="text-embedding-3-small"):
    if isinstance(text, list):
        input_text = text
    else:
        input_text = [text]

    response = client.embeddings.create(
        model=model,
        input=input_text
    )

    return [e.embedding for e in response.data]

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@app.route("/search", methods=["POST"])
def search():
    data = request.json
    query = data["query"]
    tabs = data["tabs"]

    query_embedding = get_embedding(query)[0]
    tab_embeddings = get_embedding(tabs)

    similarities = [cosine_similarity(query_embedding, tab) for tab in tab_embeddings]
    best_index = int(np.argmax(similarities))

    return jsonify({"bestIndex": best_index})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
