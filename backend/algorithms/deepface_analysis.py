import os
import cv2
import numpy as np
from deepface import DeepFace


def save_image(image, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    cv2.imwrite(path, image)


def create_face_detection_visualization(image, faces):
    """
    Draw bounding boxes around detected faces.
    """

    result = image.copy()

    for index, face in enumerate(faces, start=1):

        x = int(face["x"])
        y = int(face["y"])
        w = int(face["w"])
        h = int(face["h"])

        cv2.rectangle(
            result,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            3
        )

        cv2.putText(
            result,
            f"Face {index}",
            (x, max(30, y - 10)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2,
            cv2.LINE_AA
        )

    return result


def create_face_crop(image, face):
    """
    Extract a detected face from the original image.
    """

    x = max(0, int(face["x"]))
    y = max(0, int(face["y"]))
    w = int(face["w"])
    h = int(face["h"])

    height, width = image.shape[:2]

    x2 = min(width, x + w)
    y2 = min(height, y + h)

    crop = image[y:y2, x:x2]

    return crop


def run_deepface(image_path, output_dir, *args, **kwargs):

    os.makedirs(output_dir, exist_ok=True)

    # ---------------------------------------------------------
    # 1. Read image
    # ---------------------------------------------------------

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            "Unable to read the uploaded image."
        )

    original = image.copy()

    # ---------------------------------------------------------
    # 2. Convert BGR → RGB
    # ---------------------------------------------------------

    rgb_image = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    # ---------------------------------------------------------
    # 3. Detect faces
    # ---------------------------------------------------------

    try:

        detections = DeepFace.extract_faces(
            img_path=rgb_image,
            detector_backend="opencv",
            enforce_detection=False,
            align=True
        )

    except Exception as exc:

        raise RuntimeError(
            f"DeepFace face detection failed: {exc}"
        )

    faces = []

    for detection in detections:

        facial_area = detection.get(
            "facial_area",
            {}
        )

        if not facial_area:
            continue

        x = int(facial_area.get("x", 0))
        y = int(facial_area.get("y", 0))
        w = int(facial_area.get("w", 0))
        h = int(facial_area.get("h", 0))

        if w <= 0 or h <= 0:
            continue

        faces.append({
            "x": x,
            "y": y,
            "w": w,
            "h": h
        })

    # ---------------------------------------------------------
    # 4. Face detection visualization
    # ---------------------------------------------------------

    detection_result = create_face_detection_visualization(
        original,
        faces
    )

    # ---------------------------------------------------------
    # 5. Face crop
    # ---------------------------------------------------------

    if faces:

        largest_face = max(
            faces,
            key=lambda face: face["w"] * face["h"]
        )

        face_crop = create_face_crop(
            original,
            largest_face
        )

    else:

        face_crop = original.copy()

    # ---------------------------------------------------------
    # 6. DeepFace analysis
    # ---------------------------------------------------------

    analyses = []

    for index, face in enumerate(faces):

        try:

            crop = create_face_crop(
                original,
                face
            )

            if crop.size == 0:
                continue

            analysis = DeepFace.analyze(
                img_path=crop,
                actions=[
                    "age",
                    "gender",
                    "emotion",
                    "race"
                ],
                detector_backend="skip",
                enforce_detection=False,
                silent=True
            )

            if isinstance(analysis, list):

                analysis = analysis[0]

            emotion_scores = analysis.get(
                "emotion",
                {}
            )

            dominant_emotion = analysis.get(
                "dominant_emotion",
                None
            )

            gender = analysis.get(
                "dominant_gender",
                None
            )

            if gender is None:
                gender = analysis.get(
                    "gender",
                    None
                )

            race_scores = analysis.get(
                "race",
                {}
            )

            dominant_race = analysis.get(
                "dominant_race",
                None
            )

            analyses.append({
                "face_id": index + 1,

                "age": round(
                    float(analysis.get("age", 0)),
                    1
                ),

                "gender": gender,

                "emotion": dominant_emotion,

                "emotion_scores": {
                    key: round(
                        float(value),
                        2
                    )
                    for key, value in emotion_scores.items()
                },

                "race": dominant_race,

                "race_scores": {
                    key: round(
                        float(value),
                        2
                    )
                    for key, value in race_scores.items()
                },

                "region": {
                    "x": face["x"],
                    "y": face["y"],
                    "width": face["w"],
                    "height": face["h"]
                }
            })

        except Exception as exc:

            analyses.append({
                "face_id": index + 1,
                "error": str(exc),
                "region": {
                    "x": face["x"],
                    "y": face["y"],
                    "width": face["w"],
                    "height": face["h"]
                }
            })

    # ---------------------------------------------------------
    # 7. Save pipeline images
    # ---------------------------------------------------------

    original_path = os.path.join(
        output_dir,
        "original.jpg"
    )

    detection_path = os.path.join(
        output_dir,
        "face_detection.jpg"
    )

    face_crop_path = os.path.join(
        output_dir,
        "face_crop.jpg"
    )

    save_image(
        original,
        original_path
    )

    save_image(
        detection_result,
        detection_path
    )

    save_image(
        face_crop,
        face_crop_path
    )

    # ---------------------------------------------------------
    # 8. Return result
    # ---------------------------------------------------------

    return {

        "algorithm": "DeepFace",

        "detector": "OpenCV",

        "face_count": len(faces),

        "analyses": analyses,

        "stages": {

            "original":
                "/results/deepface/original.jpg",

            "face_detection":
                "/results/deepface/face_detection.jpg",

            "face_crop":
                "/results/deepface/face_crop.jpg"
        },

        "explanation": {

            "input": (
                "The uploaded image is provided to "
                "the DeepFace pipeline."
            ),

            "detection": (
                "DeepFace detects facial regions using "
                "the selected OpenCV face detector."
            ),

            "alignment": (
                "Detected faces are aligned to improve "
                "the consistency of facial analysis."
            ),

            "analysis": (
                "DeepFace analyzes facial attributes "
                "including age, gender, emotion and "
                "dominant race category."
            ),

            "result": (
                f"DeepFace processed "
                f"{len(faces)} detected face(s)."
            )
        }
    }