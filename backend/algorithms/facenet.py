import os
import cv2
import numpy as np
from keras_facenet import FaceNet


# Load FaceNet once when the module starts.
embedder = FaceNet()


def save_image(image, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    cv2.imwrite(path, image)


def detect_face(image):
    """
    Detect the largest face using OpenCV Haar Cascade.
    """

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    cascade_path = os.path.join(
        cv2.data.haarcascades,
        "haarcascade_frontalface_default.xml"
    )

    detector = cv2.CascadeClassifier(cascade_path)

    if detector.empty():
        raise RuntimeError(
            "Unable to load Haar Cascade."
        )

    faces = detector.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(40, 40)
    )

    if len(faces) == 0:
        return None

    # Select largest detected face.
    face = max(
        faces,
        key=lambda item: item[2] * item[3]
    )

    x, y, w, h = face

    return {
        "x": int(x),
        "y": int(y),
        "w": int(w),
        "h": int(h)
    }


def crop_face(image, face):
    x = face["x"]
    y = face["y"]
    w = face["w"]
    h = face["h"]

    return image[
        y:y + h,
        x:x + w
    ]


def prepare_face(face):
    """
    Resize face to FaceNet input size.
    """

    face_rgb = cv2.cvtColor(
        face,
        cv2.COLOR_BGR2RGB
    )

    face_rgb = cv2.resize(
        face_rgb,
        (160, 160)
    )

    face_rgb = face_rgb.astype(
        np.float32
    )

    return face_rgb


def calculate_similarity(embedding1, embedding2):
    """
    Calculate cosine similarity.
    """

    vector1 = np.asarray(
        embedding1,
        dtype=np.float32
    )

    vector2 = np.asarray(
        embedding2,
        dtype=np.float32
    )

    denominator = (
        np.linalg.norm(vector1)
        * np.linalg.norm(vector2)
    )

    if denominator == 0:
        return 0.0

    cosine_similarity = (
        np.dot(vector1, vector2)
        / denominator
    )

    return float(cosine_similarity)


def create_detection_image(
    image,
    face,
    label
):
    result = image.copy()

    if face is not None:

        x = face["x"]
        y = face["y"]
        w = face["w"]
        h = face["h"]

        cv2.rectangle(
            result,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            3
        )

        cv2.putText(
            result,
            label,
            (x, max(30, y - 10)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.75,
            (0, 255, 0),
            2,
            cv2.LINE_AA
        )

    return result


def create_embedding_visualization(
    embedding1,
    embedding2
):
    """
    Visualize the first 128 dimensions of the
    two actual FaceNet embeddings.
    """

    emb1 = np.asarray(
        embedding1,
        dtype=np.float32
    )

    emb2 = np.asarray(
        embedding2,
        dtype=np.float32
    )

    dimensions = min(
        128,
        len(emb1),
        len(emb2)
    )

    canvas_width = 1200
    canvas_height = 500

    canvas = np.ones(
        (
            canvas_height,
            canvas_width,
            3
        ),
        dtype=np.uint8
    ) * 245

    values1 = emb1[:dimensions]
    values2 = emb2[:dimensions]

    max_value = max(
        np.max(np.abs(values1)),
        np.max(np.abs(values2)),
        1e-6
    )

    left_x = 60
    right_x = 600

    graph_width = 500
    graph_height = 340

    top = 90
    bottom = top + graph_height

    cv2.putText(
        canvas,
        "Image 1 Embedding",
        (left_x, 45),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (70, 60, 90),
        2
    )

    cv2.putText(
        canvas,
        "Image 2 Embedding",
        (right_x, 45),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (70, 60, 90),
        2
    )

    for start_x, values in [
        (left_x, values1),
        (right_x, values2)
    ]:

        center_y = top + graph_height // 2

        cv2.line(
            canvas,
            (start_x, center_y),
            (start_x + graph_width, center_y),
            (180, 175, 190),
            1
        )

        previous_point = None

        for index, value in enumerate(values):

            x = start_x + int(
                index / max(1, dimensions - 1)
                * graph_width
            )

            y = center_y - int(
                (value / max_value)
                * (graph_height / 2 - 15)
            )

            point = (x, y)

            if previous_point is not None:

                cv2.line(
                    canvas,
                    previous_point,
                    point,
                    (120, 90, 190),
                    2
                )

            previous_point = point

    cv2.putText(
        canvas,
        "First 128 embedding dimensions",
        (400, 475),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (110, 100, 125),
        1
    )

    return canvas


def run_facenet(
    image1_path,
    image2_path,
    *args,
    **kwargs
):

    # =====================================================
    # LOAD IMAGES
    # =====================================================

    image1 = cv2.imread(
        str(image1_path)
    )

    image2 = cv2.imread(
        str(image2_path)
    )

    if image1 is None:
        raise ValueError(
            "Unable to read Image 1."
        )

    if image2 is None:
        raise ValueError(
            "Unable to read Image 2."
        )

    # =====================================================
    # FACE DETECTION
    # =====================================================

    face1 = detect_face(image1)
    face2 = detect_face(image2)

    if face1 is None:
        raise ValueError(
            "No face detected in Image 1."
        )

    if face2 is None:
        raise ValueError(
            "No face detected in Image 2."
        )

    # =====================================================
    # FACE CROPPING
    # =====================================================

    crop1 = crop_face(
        image1,
        face1
    )

    crop2 = crop_face(
        image2,
        face2
    )

    # =====================================================
    # PREPROCESSING
    # =====================================================

    prepared1 = prepare_face(crop1)
    prepared2 = prepare_face(crop2)

    # =====================================================
    # CREATE BATCH
    # =====================================================

    batch1 = np.expand_dims(
        prepared1,
        axis=0
    )

    batch2 = np.expand_dims(
        prepared2,
        axis=0
    )

    # =====================================================
    # FACENET EMBEDDINGS
    # =====================================================

    embedding1 = embedder.embeddings(
        batch1
    )[0]

    embedding2 = embedder.embeddings(
        batch2
    )[0]

    # =====================================================
    # NORMALIZE EMBEDDINGS
    # =====================================================

    embedding1 = embedding1 / (
        np.linalg.norm(embedding1) + 1e-10
    )

    embedding2 = embedding2 / (
        np.linalg.norm(embedding2) + 1e-10
    )

    # =====================================================
    # SIMILARITY
    # =====================================================

    similarity = calculate_similarity(
        embedding1,
        embedding2
    )

    similarity_percentage = (
        max(0.0, min(1.0, similarity))
        * 100
    )

    # FaceNet embeddings are compared using a
    # distance/similarity measure. A threshold of
    # 0.70 cosine similarity is used here for this
    # educational demonstration.

    threshold = 0.70

    same_person = (
        similarity >= threshold
    )

    # =====================================================
    # VISUALIZATIONS
    # =====================================================

    detection1 = create_detection_image(
        image1,
        face1,
        "Face 1"
    )

    detection2 = create_detection_image(
        image2,
        face2,
        "Face 2"
    )

    embedding_visualization = (
        create_embedding_visualization(
            embedding1,
            embedding2
        )
    )

    # =====================================================
    # SAVE RESULTS
    # =====================================================

    output_dir = kwargs.get(
        "output_dir"
    )

    if output_dir is None:

        # Main.py currently doesn't pass an output
        # directory, so create one beside results.

        output_dir = os.path.join(
            os.path.dirname(
                os.path.abspath(
                    str(image1_path)
                )
            ),
            "..",
            "results",
            "facenet"
        )

    output_dir = os.path.abspath(
        output_dir
    )

    os.makedirs(
        output_dir,
        exist_ok=True
    )

    original1_path = os.path.join(
        output_dir,
        "image1_original.jpg"
    )

    original2_path = os.path.join(
        output_dir,
        "image2_original.jpg"
    )

    detection1_path = os.path.join(
        output_dir,
        "image1_detection.jpg"
    )

    detection2_path = os.path.join(
        output_dir,
        "image2_detection.jpg"
    )

    crop1_path = os.path.join(
        output_dir,
        "image1_face.jpg"
    )

    crop2_path = os.path.join(
        output_dir,
        "image2_face.jpg"
    )

    embedding_path = os.path.join(
        output_dir,
        "embedding_visualization.jpg"
    )

    save_image(
        image1,
        original1_path
    )

    save_image(
        image2,
        original2_path
    )

    save_image(
        detection1,
        detection1_path
    )

    save_image(
        detection2,
        detection2_path
    )

    save_image(
        crop1,
        crop1_path
    )

    save_image(
        crop2,
        crop2_path
    )

    save_image(
        embedding_visualization,
        embedding_path
    )

    # =====================================================
    # RETURN RESULT
    # =====================================================

    return {

        "algorithm": "FaceNet",

        "model": "FaceNet",

        "embedding_dimension": int(
            len(embedding1)
        ),

        "similarity": round(
            similarity,
            4
        ),

        "similarity_percentage": round(
            similarity_percentage,
            2
        ),

        "threshold": threshold,

        "same_person": same_person,

        "verification": (
            "Same Person"
            if same_person
            else "Different People"
        ),

        "stages": {

            "image1_original":
                "/results/facenet/image1_original.jpg",

            "image2_original":
                "/results/facenet/image2_original.jpg",

            "image1_detection":
                "/results/facenet/image1_detection.jpg",

            "image2_detection":
                "/results/facenet/image2_detection.jpg",

            "image1_face":
                "/results/facenet/image1_face.jpg",

            "image2_face":
                "/results/facenet/image2_face.jpg",

            "embedding":
                "/results/facenet/embedding_visualization.jpg"
        },

        "explanation": {

            "detection":
                "Each image is processed to locate the largest visible face.",

            "preprocessing":
                "The detected faces are converted to RGB and resized to 160 × 160 pixels.",

            "embedding":
                "FaceNet converts each face into a numerical embedding representing facial features.",

            "comparison":
                "The two FaceNet embeddings are compared using cosine similarity.",

            "decision":
                f"The measured similarity is {similarity_percentage:.2f}%. "
                f"The demonstration threshold is {threshold:.2f}."
        }
    }