from pathlib import Path
import numpy as np


def _load_facenet():
    # DeepFace exposes Facenet embeddings and is used here as the model adapter.
    try:
        from deepface import DeepFace
        return DeepFace
    except ImportError as exc:
        raise RuntimeError(
            "FaceNet support requires DeepFace. Run: pip install deepface"
        ) from exc


def run_facenet(image1: Path, image2: Path):
    DeepFace = _load_facenet()

    reps1 = DeepFace.represent(img_path=str(image1), model_name="Facenet", enforce_detection=True)
    reps2 = DeepFace.represent(img_path=str(image2), model_name="Facenet", enforce_detection=True)

    emb1 = np.asarray(reps1[0]["embedding"], dtype=float)
    emb2 = np.asarray(reps2[0]["embedding"], dtype=float)

    distance = float(np.linalg.norm(emb1 - emb2))
    threshold = 0.4
    verified = distance <= threshold

    return {
        "algorithm": "FaceNet",
        "model": "Facenet",
        "embedding_dimensions": int(len(emb1)),
        "euclidean_distance": round(distance, 6),
        "threshold": threshold,
        "same_identity": bool(verified),
        "embedding_1_preview": [round(float(x), 5) for x in emb1[:12]],
        "embedding_2_preview": [round(float(x), 5) for x in emb2[:12]],
    }
