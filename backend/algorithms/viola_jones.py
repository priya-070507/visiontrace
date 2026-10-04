import cv2
import numpy as np
import os


def save_image(image, path):
    """
    Save an OpenCV image safely.
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    cv2.imwrite(path, image)


def create_haar_feature_visualization(gray, faces):
    """
    Creates an educational visualization of Haar-like features.

    NOTE:
    OpenCV does not expose the exact internal Haar features selected
    by the trained cascade. Therefore, this is a conceptual
    visualization showing how Haar-like rectangular features work.
    """

    # Convert grayscale image to BGR for drawing
    visualization = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

    height, width = gray.shape

    if len(faces) > 0:
        # Use the largest detected face
        x, y, w, h = max(
            faces,
            key=lambda face: face[2] * face[3]
        )

        # Create a two-rectangle Haar feature around the eye region
        feature_x = x + int(w * 0.18)
        feature_y = y + int(h * 0.25)

        feature_w = int(w * 0.64)
        feature_h = max(10, int(h * 0.18))

    else:
        # Fallback if no face was detected
        feature_w = max(40, int(width * 0.35))
        feature_h = max(20, int(height * 0.15))

        feature_x = max(0, (width - feature_w) // 2)
        feature_y = max(0, (height - feature_h) // 3)

    # Keep coordinates inside image
    feature_x = max(0, min(feature_x, width - 1))
    feature_y = max(0, min(feature_y, height - 1))

    feature_w = min(feature_w, width - feature_x)
    feature_h = min(feature_h, height - feature_y)

    half_w = max(1, feature_w // 2)

    # Left rectangle
    cv2.rectangle(
        visualization,
        (feature_x, feature_y),
        (feature_x + half_w, feature_y + feature_h),
        (255, 255, 255),
        -1
    )

    # Right rectangle
    cv2.rectangle(
        visualization,
        (feature_x + half_w, feature_y),
        (feature_x + feature_w, feature_y + feature_h),
        (0, 0, 0),
        -1
    )

    # Draw border
    cv2.rectangle(
        visualization,
        (feature_x, feature_y),
        (feature_x + feature_w, feature_y + feature_h),
        (0, 255, 255),
        2
    )

    # Label
    label = "Haar-like feature"
    cv2.putText(
        visualization,
        label,
        (feature_x, max(25, feature_y - 10)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (0, 255, 255),
        2,
        cv2.LINE_AA
    )

    return visualization


def create_integral_image(gray):
    """
    Generate an integral-image visualization.

    Integral image stores the cumulative pixel sum from
    the top-left corner to each pixel.
    """

    integral = cv2.integral(gray)

    # Remove the extra first row and column for visualization
    integral = integral[1:, 1:]

    # Normalize cumulative values to 0-255
    integral_normalized = cv2.normalize(
        integral,
        None,
        0,
        255,
        cv2.NORM_MINMAX
    )

    integral_normalized = integral_normalized.astype(np.uint8)

    # Apply a colormap so the cumulative values are easier to see
    integral_color = cv2.applyColorMap(
        integral_normalized,
        cv2.COLORMAP_VIRIDIS
    )

    return integral_color


def run_viola_jones(image_path, output_dir, *args, **kwargs):
    """
    Complete Viola-Jones face detection pipeline.

    Extra arguments are accepted for compatibility with the
    existing FastAPI endpoint.
    """

    os.makedirs(output_dir, exist_ok=True)

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Unable to read the uploaded image.")

    original = image.copy()

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Load Haar Cascade
    cascade_path = os.path.join(
        cv2.data.haarcascades,
        "haarcascade_frontalface_default.xml"
    )

    face_cascade = cv2.CascadeClassifier(cascade_path)

    if face_cascade.empty():
        raise RuntimeError(
            "Could not load Haar Cascade classifier."
        )

    # Detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=6,
        minSize=(35, 35)
    )

    # Create visualizations
    haar_features = create_haar_feature_visualization(
        gray,
        faces
    )

    integral_image = create_integral_image(gray)

    # Draw detections
    detection_result = original.copy()

    for index, (x, y, w, h) in enumerate(faces, start=1):

        cv2.rectangle(
            detection_result,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            3
        )

        cv2.putText(
            detection_result,
            f"Face {index}",
            (x, max(30, y - 10)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.75,
            (0, 255, 0),
            2,
            cv2.LINE_AA
        )

    # Save images
    original_path = os.path.join(
        output_dir,
        "original.jpg"
    )

    grayscale_path = os.path.join(
        output_dir,
        "grayscale.jpg"
    )

    haar_path = os.path.join(
        output_dir,
        "haar_features.jpg"
    )

    integral_path = os.path.join(
        output_dir,
        "integral_image.jpg"
    )

    result_path = os.path.join(
        output_dir,
        "detection_result.jpg"
    )

    save_image(original, original_path)
    save_image(gray, grayscale_path)
    save_image(haar_features, haar_path)
    save_image(integral_image, integral_path)
    save_image(detection_result, result_path)

    detected_faces = []

    for index, (x, y, w, h) in enumerate(faces, start=1):
        detected_faces.append({
            "face_id": index,
            "x": int(x),
            "y": int(y),
            "width": int(w),
            "height": int(h)
        })

    return {
        "algorithm": "Viola-Jones",
        "classifier": "Haar Cascade",

        "face_count": len(faces),

        "faces": detected_faces,

         "stages": {
        "original": "/results/original.jpg",
        "grayscale": "/results/grayscale.jpg",
        "haar_features": "/results/haar_features.jpg",
        "integral_image": "/results/integral_image.jpg",
        "result": "/results/detection_result.jpg"
    },

        "explanation": {
            "input": (
                "The uploaded image is used as the input "
                "for face detection."
            ),

            "grayscale": (
                "The image is converted to grayscale because "
                "Haar Cascade detection works on intensity values."
            ),

            "haar_features": (
                "Haar-like rectangular features compare "
                "brightness differences between neighboring "
                "regions."
            ),

            "integral_image": (
                "The integral image allows rectangular pixel "
                "sums to be calculated efficiently."
            ),

            "cascade": (
                "The trained Haar Cascade classifier evaluates "
                "multiple features through a sequence of "
                "classifier stages."
            ),

            "result": (
                f"The classifier detected {len(faces)} face(s) "
                "in the image."
            )
        },

        "educational_note": (
            "The Haar feature visualization is conceptual. "
            "OpenCV does not expose the exact internal Haar "
            "features selected by the trained cascade."
        )
    }