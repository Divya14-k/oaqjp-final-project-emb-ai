"""Call IBM Watson NLP and format its emotion classification response."""

import requests

API_URL = (
    "https://sn-watson-emotion.labs.skills.network/"
    "v1/watson.runtime.nlp.v1/NlpService/EmotionPredict"
)
MODEL_ID = "emotion_aggregated-workflow_lang_en_stock"
EMOTIONS = ("anger", "disgust", "fear", "joy", "sadness")


def _empty_result():
    """Return the required output shape when the service rejects input."""
    return {
        "anger": None,
        "disgust": None,
        "fear": None,
        "joy": None,
        "sadness": None,
        "dominant_emotion": None,
    }


def emotion_detector(text_to_analyze):
    """Return the five Watson emotion scores and their dominant label."""
    if not isinstance(text_to_analyze, str) or not text_to_analyze.strip():
        return _empty_result()

    headers = {"grpc-metadata-mm-model-id": MODEL_ID}
    payload = {"raw_document": {"text": text_to_analyze}}
    response = requests.post(API_URL, json=payload, headers=headers, timeout=15)

    if response.status_code == 400:
        return _empty_result()

    response.raise_for_status()
    response_data = response.json()
    predictions = response_data.get("emotionPredictions", [])
    if not predictions:
        raise ValueError("Watson NLP returned no emotion predictions.")

    scores = predictions[0].get("emotion", {})
    result = {emotion: scores[emotion] for emotion in EMOTIONS}
    result["dominant_emotion"] = max(EMOTIONS, key=result.__getitem__)
    return result
