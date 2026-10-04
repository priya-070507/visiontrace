from pathlib import Path
import cv2
import uuid


def _save(image, results_dir: Path, prefix: str):
    """
    Save an OpenCV image and return the URL path used by FastAPI.
    """
    filename = f"{prefix}_{uuid.uuid4().hex}.jpg"
    output_path = results_dir / filename

    cv2.imwrite(str(output_path), image)

    return f"/results/{filename}"


def run_template_matching(
    image_path: Path,
    template_path: Path,
    results_dir: Path
):
    """
    Perform template matching and generate intermediate
    visualizations for the VisionTrace frontend.
    """

    # ---------------------------------------------------------
    # 1. Read images
    # ---------------------------------------------------------

    image = cv2.imread(str(image_path))
    template = cv2.imread(str(template_path))

    if image is None:
        raise ValueError("Could not read the main image.")

    if template is None:
        raise ValueError("Could not read the template image.")

    # ---------------------------------------------------------
    # 2. Convert both images to grayscale
    # ---------------------------------------------------------

    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray_template = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)

    image_height, image_width = gray_image.shape
    template_height, template_width = gray_template.shape

    # Template must fit inside the main image
    if template_height > image_height or template_width > image_width:
        raise ValueError(
            "The template image must be smaller than the main image."
        )

    # ---------------------------------------------------------
    # 3. Template matching
    # ---------------------------------------------------------

    method = cv2.TM_CCOEFF_NORMED

    result = cv2.matchTemplate(
        gray_image,
        gray_template,
        method
    )

    # Find the best match
    min_value, max_value, min_location, max_location = cv2.minMaxLoc(
        result
    )

    # TM_CCOEFF_NORMED:
    # Higher value = better match
    best_location = max_location
    match_score = max_value

    x, y = best_location

    # ---------------------------------------------------------
    # 4. Create similarity map
    # ---------------------------------------------------------

    # Normalize result to 0-255 so it can be displayed
    similarity_map = cv2.normalize(
        result,
        None,
        0,
        255,
        cv2.NORM_MINMAX
    )

    similarity_map = similarity_map.astype("uint8")

    # Apply a color map for easier visualization
    similarity_heatmap = cv2.applyColorMap(
        similarity_map,
        cv2.COLORMAP_VIRIDIS
    )

    # ---------------------------------------------------------
    # 5. Create result image
    # ---------------------------------------------------------

    result_image = image.copy()

    # Draw bounding box around best match
    cv2.rectangle(
        result_image,
        (x, y),
        (x + template_width, y + template_height),
        (90, 37, 232),
        4
    )

    # Label
    label = f"Best Match: {match_score:.3f}"

    label_y = max(30, y - 10)

    cv2.putText(
        result_image,
        label,
        (x, label_y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (90, 37, 232),
        2,
        cv2.LINE_AA
    )

    # ---------------------------------------------------------
    # 6. Create template preview
    # ---------------------------------------------------------

    template_preview = template.copy()

    cv2.rectangle(
        template_preview,
        (0, 0),
        (
            template_width - 1,
            template_height - 1
        ),
        (90, 37, 232),
        3
    )

    # ---------------------------------------------------------
    # 7. Save all stages
    # ---------------------------------------------------------

    original_url = _save(
        image,
        results_dir,
        "template_original"
    )

    grayscale_url = _save(
        gray_image,
        results_dir,
        "template_grayscale"
    )

    template_url = _save(
        template_preview,
        results_dir,
        "template_reference"
    )

    heatmap_url = _save(
        similarity_heatmap,
        results_dir,
        "template_heatmap"
    )

    result_url = _save(
        result_image,
        results_dir,
        "template_result"
    )

    # ---------------------------------------------------------
    # 8. Return structured result
    # ---------------------------------------------------------

    return {
        "algorithm": "Template Matching",

        "method": "TM_CCOEFF_NORMED",

        "match_score": round(
            float(match_score),
            4
        ),

        "match_percentage": round(
            float(match_score * 100),
            2
        ),

        "location": {
            "x": int(x),
            "y": int(y)
        },

        "template_size": {
            "width": int(template_width),
            "height": int(template_height)
        },

        "source_image_size": {
            "width": int(image_width),
            "height": int(image_height)
        },

        "stages": {
            "original": original_url,
            "grayscale": grayscale_url,
            "template": template_url,
            "similarity_map": heatmap_url,
            "result": result_url
        },

        "explanation": {
            "input": "The original image is provided as the search area.",
            "grayscale": "Both images are converted to grayscale to simplify intensity comparison.",
            "matching": "The template is compared against different regions of the source image.",
            "similarity": "TM_CCOEFF_NORMED produces a normalized similarity score for each position.",
            "result": "The position with the highest similarity score is selected as the best match."
        }
    }