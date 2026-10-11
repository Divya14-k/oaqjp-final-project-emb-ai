# Watson NLP Emotion Detector

A small Flask web application that analyzes a sentence with IBM Watson NLP and reports its anger, disgust, fear, joy, and sadness scores, along with the dominant emotion.

## Run locally

```bash
python3 -m pip install -r requirements.txt
python3 server.py
```

Open `http://127.0.0.1:5000` in a browser. Enter a sentence and select **Analyze emotion**. The API route is `/emotionDetector?textToAnalyze=...`.

The application sends the text to the Watson NLP Emotion Predict endpoint with the `emotion_aggregated-workflow_lang_en_stock` model. A blank request is rejected with HTTP 400. If the Watson service is unavailable, the app returns an HTTP 503 response with a clear message.

## Tests and static analysis

The unit tests mock Watson's HTTP response so they run consistently without a live model endpoint:

```bash
python3 -m unittest -v test_emotion_detection.py
python3 -m pylint server.py
```

The five required statement-to-emotion cases are covered, as are the HTTP 400 response, blank input, and service error handling.

## Project layout

```text
EmotionDetection/
  __init__.py
  emotion_detection.py
static/
  app.css
  mywebscript.js
templates/
  index.html
server.py
test_emotion_detection.py
```
