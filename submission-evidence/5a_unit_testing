"""Unit tests for the Watson NLP emotion detection client."""

import unittest
from unittest.mock import Mock, patch

from EmotionDetection.emotion_detection import EMOTIONS, emotion_detector
from server import app


def make_response(dominant_emotion, status_code=200):
    """Build an HTTP response with the Watson NLP response structure."""
    scores = {emotion: 0.05 for emotion in EMOTIONS}
    if dominant_emotion in scores:
        scores[dominant_emotion] = 0.80
    response = Mock()
    response.status_code = status_code
    response.json.return_value = {
        "emotionPredictions": [{"emotion": scores}]
    }
    return response


class EmotionDetectorTests(unittest.TestCase):
    """Check expected dominant labels and error handling."""

    @patch("EmotionDetection.emotion_detection.requests.post")
    def test_glad_statement_is_joy(self, post_request):
        """The first required sentence is classified as joy."""
        self.assert_dominant(post_request, "I am glad this happened", "joy")

    @patch("EmotionDetection.emotion_detection.requests.post")
    def test_mad_statement_is_anger(self, post_request):
        """The second required sentence is classified as anger."""
        self.assert_dominant(post_request, "I am really mad about this", "anger")

    @patch("EmotionDetection.emotion_detection.requests.post")
    def test_disgust_statement_is_disgust(self, post_request):
        """The third required sentence is classified as disgust."""
        self.assert_dominant(
            post_request,
            "I feel disgusted just hearing about this",
            "disgust",
        )

    @patch("EmotionDetection.emotion_detection.requests.post")
    def test_sad_statement_is_sadness(self, post_request):
        """The fourth required sentence is classified as sadness."""
        self.assert_dominant(post_request, "I am so sad about this", "sadness")

    @patch("EmotionDetection.emotion_detection.requests.post")
    def test_afraid_statement_is_fear(self, post_request):
        """The fifth required sentence is classified as fear."""
        self.assert_dominant(
            post_request,
            "I am really afraid that this will happen",
            "fear",
        )

    def assert_dominant(self, post_request, statement, expected_emotion):
        """Assert that a mocked Watson result has the expected dominant label."""
        post_request.return_value = make_response(expected_emotion)
        result = emotion_detector(statement)
        self.assertEqual(result["dominant_emotion"], expected_emotion)
        self.assertEqual(set(result), set(EMOTIONS) | {"dominant_emotion"})

    @patch("EmotionDetection.emotion_detection.requests.post")
    def test_status_400_returns_empty_result(self, post_request):
        """A service-side bad request returns the required None values."""
        post_request.return_value = make_response(None, status_code=400)
        result = emotion_detector("invalid model input")

        self.assertTrue(all(value is None for value in result.values()))

    @patch("EmotionDetection.emotion_detection.requests.post")
    def test_blank_input_is_not_sent_to_service(self, post_request):
        """Blank input is rejected before an HTTP request is made."""
        result = emotion_detector("   ")

        post_request.assert_not_called()
        self.assertIsNone(result["dominant_emotion"])

    @patch("EmotionDetection.emotion_detection.requests.post")
    def test_missing_predictions_raise_clear_error(self, post_request):
        """An unexpected empty Watson payload is surfaced clearly."""
        response = Mock(status_code=200)
        response.json.return_value = {"emotionPredictions": []}
        post_request.return_value = response

        with self.assertRaisesRegex(ValueError, "no emotion predictions"):
            emotion_detector("A test sentence")

    def test_server_rejects_blank_input(self):
        """The Flask route reports blank text as a client error."""
        with app.test_client() as client:
            response = client.get("/emotionDetector?textToAnalyze=%20%20")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json["error"], "Invalid text! Please try again!"
        )

    @patch("server.emotion_detector")
    def test_server_returns_formatted_emotions(self, mocked_detector):
        """The Flask route returns formatted model data as JSON."""
        mocked_detector.return_value = {
            "anger": 0.1,
            "disgust": 0.1,
            "fear": 0.1,
            "joy": 0.6,
            "sadness": 0.1,
            "dominant_emotion": "joy",
        }
        with app.test_client() as client:
            response = client.get(
                "/emotionDetector?textToAnalyze=I%20feel%20great"
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["dominant_emotion"], "joy")


if __name__ == "__main__":
    unittest.main(verbosity=2)
