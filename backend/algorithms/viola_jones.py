from pathlib import Path
import cv2
import uuid


def run_viola_jones(image_path: Path, results_dir: Path, scale_factor: float = 1.1, min_neighbors: int = 5):
    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError("Could not read the supplied image.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    cascade = cv2.CascadeClassifier(cascade_path)

    if cascade.empty():
        raise RuntimeError("OpenCV Haar cascade could not be loaded.")

    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=float(scale_factor),
        minNeighbors=int(min_neighbors),
        minSize=(30, 30),
    )

    output = image.copy()
    for i, (x, y, w, h) in enumerate(faces, 1):
        cv2.rectangle(output, (x, y), (x + w, y + h), (95, 42, 232), 3)
        cv2.putText(output, f"FACE {i}", (x, max(22, y - 8)), cv2.FONT_HERSHEY_SIMPLEX, .65, (95,42,232), 2)

    name = f"viola_{uuid.uuid4().hex}.jpg"
    cv2.imwrite(str(results_dir / name), output)

    return {
        "algorithm": "Viola-Jones",
        "classifier": "Haar Cascade",
        "faces_detected": int(len(faces)),
        "scale_factor": float(scale_factor),
        "min_neighbors": int(min_neighbors),
        "result_image": f"/results/{name}",
    }
