from pathlib import Path
import cv2
import uuid


def run_template_matching(image_path: Path, template_path: Path, results_dir: Path):
    image = cv2.imread(str(image_path))
    template = cv2.imread(str(template_path))

    if image is None or template is None:
        raise ValueError("Could not read one of the supplied images.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    template_gray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)

    th, tw = template_gray.shape[:2]
    ih, iw = gray.shape[:2]
    if th > ih or tw > iw:
        raise ValueError("Template must be smaller than the input image.")

    response = cv2.matchTemplate(gray, template_gray, cv2.TM_CCOEFF_NORMED)
    _, max_score, _, max_loc = cv2.minMaxLoc(response)

    x, y = max_loc
    output = image.copy()
    cv2.rectangle(output, (x, y), (x + tw, y + th), (95, 42, 232), 3)
    cv2.putText(
        output,
        f"Match: {max_score:.3f}",
        (x, max(25, y - 10)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (95, 42, 232),
        2,
        cv2.LINE_AA,
    )

    name = f"template_{uuid.uuid4().hex}.jpg"
    cv2.imwrite(str(results_dir / name), output)

    return {
        "algorithm": "Template Matching",
        "method": "TM_CCOEFF_NORMED",
        "match_score": round(float(max_score), 4),
        "location": {"x": int(x), "y": int(y)},
        "template_size": {"width": int(tw), "height": int(th)},
        "result_image": f"/results/{name}",
    }
