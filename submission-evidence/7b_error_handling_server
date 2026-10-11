"""Serve the Watson NLP emotion detector as a small Flask application."""

import os

import requests
from flask import Flask, jsonify, render_template, request

from EmotionDetection.emotion_detection import emotion_detector

app = Flask(__name__)


@app.get("/")
def index():
    """Render the emotion analysis page."""
    return render_template("index.html")


@app.get("/emotionDetector")
def analyze_emotion():
    """Analyze query text and return emotion scores as JSON."""
    text_to_analyze = request.args.get("textToAnalyze", "").strip()
    if not text_to_analyze:
        return jsonify(error="Invalid text! Please try again!"), 400

    try:
        result = emotion_detector(text_to_analyze)
    except (requests.RequestException, ValueError):
        app.logger.exception("Watson NLP emotion analysis failed.")
        return jsonify(error="Emotion analysis is temporarily unavailable."), 503

    if result["dominant_emotion"] is None:
        return jsonify(error="Invalid text! Please try again!"), 400

    return jsonify(result)


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=int(os.environ.get("PORT", "5000")),
        debug=False,
    )
