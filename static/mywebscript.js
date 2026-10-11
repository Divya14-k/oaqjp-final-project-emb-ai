"use strict";

const form = document.getElementById("analysis-form");
const textField = document.getElementById("textToAnalyze");
const analyzeButton = document.getElementById("analyze-button");
const resultState = document.getElementById("result-state");
const resultMessage = document.getElementById("result-message");
const emotionResults = document.getElementById("emotion-results");
const emotionNames = ["anger", "disgust", "fear", "joy", "sadness"];

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  resultState.textContent = "Analyzing";
  resultMessage.textContent = "Sending your text to Watson NLP…";
  resultMessage.classList.remove("error-message");
  emotionResults.hidden = true;
  analyzeButton.disabled = true;

  try {
    const query = new URLSearchParams({ textToAnalyze: textField.value });
    const response = await fetch(`/emotionDetector?${query.toString()}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "The text could not be analyzed.");
    }
    renderResults(result);
    resultState.textContent = "Complete";
    resultMessage.textContent = `Dominant emotion: ${result.dominant_emotion}`;
  } catch (error) {
    resultState.textContent = "Needs attention";
    resultMessage.textContent = error.message;
    resultMessage.classList.add("error-message");
  } finally {
    analyzeButton.disabled = false;
  }
});

function renderResults(result) {
  emotionResults.replaceChildren();
  emotionNames.forEach((emotion) => {
    const row = document.createElement("div");
    row.className = "emotion-row";

    const label = document.createElement("span");
    label.className = "emotion-label";
    label.textContent = emotion;

    const track = document.createElement("span");
    track.className = "emotion-track";
    const fill = document.createElement("span");
    fill.className = `emotion-fill ${emotion}`;
    fill.style.width = `${Math.max(0, Math.min(100, result[emotion] * 100))}%`;
    track.append(fill);

    const score = document.createElement("span");
    score.className = "emotion-score";
    score.textContent = Number(result[emotion]).toFixed(3);

    row.append(label, track, score);
    emotionResults.append(row);
  });
  emotionResults.hidden = false;
}
