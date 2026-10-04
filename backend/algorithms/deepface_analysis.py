from pathlib import Path
import uuid
import json


def run_deepface(image_path: Path, results_dir: Path, action: str = "analyze"):
    try:
        from deepface import DeepFace
    except ImportError as exc:
        raise RuntimeError(
            "DeepFace is not installed. Run: pip install deepface"
        ) from exc

    if action == "represent":
        embedding = DeepFace.represent(
            img_path=str(image_path),
            enforce_detection=True,
        )
        return {
            "algorithm": "DeepFace",
            "action": "representation",
            "embedding_dimensions": len(embedding[0]["embedding"]),
            "embedding_preview": [round(float(x), 6) for x in embedding[0]["embedding"][:12]],
        }

    analysis = DeepFace.analyze(
        img_path=str(image_path),
        actions=["age", "gender", "emotion"],
        enforce_detection=True,
        silent=True,
    )

    if isinstance(analysis, list):
        analysis = analysis[0]

    return {
        "algorithm": "DeepFace",
        "action": "facial analysis",
        "age": analysis.get("age"),
        "dominant_gender": analysis.get("dominant_gender"),
        "dominant_emotion": analysis.get("dominant_emotion"),
        "region": analysis.get("region"),
    }
