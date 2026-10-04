from pathlib import Path
import cv2


def read_image(path: Path):
    image = cv2.imread(str(path))
    if image is None:
        raise ValueError(f"Unable to read image: {path}")
    return image
