from pathlib import Path
import uuid

import cv2
import numpy as np

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from algorithms.template_matching import run_template_matching
from algorithms.viola_jones import run_viola_jones
from algorithms.deepface_analysis import run_deepface
from algorithms.facenet import run_facenet


# =========================================================
# PATHS
# =========================================================

BASE = Path(__file__).resolve().parent

UPLOADS = BASE / "uploads"
RESULTS = BASE / "results"

UPLOADS.mkdir(exist_ok=True)
RESULTS.mkdir(exist_ok=True)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="VisionTrace API",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://visiontrace-beige.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# STATIC RESULTS
# =========================================================

app.mount(
    "/results",
    StaticFiles(directory=RESULTS),
    name="results"
)


# =========================================================
# SAVE UPLOAD
# =========================================================

async def save_upload(file: UploadFile) -> Path:

    suffix = (
        Path(file.filename or "").suffix.lower()
        or ".jpg"
    )

    path = UPLOADS / f"{uuid.uuid4().hex}{suffix}"

    path.write_bytes(
        await file.read()
    )

    return path


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health():

    return {
        "status": "ok",
        "service": "VisionTrace API"
    }


# =========================================================
# TEMPLATE MATCHING
# =========================================================

@app.post("/api/template-matching")
async def template_matching(
    image: UploadFile = File(...),
    template: UploadFile = File(...)
):

    image_path = await save_upload(image)
    template_path = await save_upload(template)

    try:

        result = run_template_matching(
            image_path,
            template_path,
            RESULTS
        )

        return result

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )


# =========================================================
# VIOLA-JONES
# =========================================================

@app.post("/api/viola-jones")
async def viola_jones(
    image: UploadFile = File(...),
    scale_factor: float = Form(1.1),
    min_neighbors: int = Form(5),
):

    image_path = await save_upload(image)

    try:

        result = run_viola_jones(
            image_path,
            RESULTS,
            scale_factor,
            min_neighbors
        )

        return result

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )


# =========================================================
# DEEPFACE
# =========================================================

@app.post("/api/deepface")
async def deepface(
    image: UploadFile = File(...)
):

    image_path = await save_upload(image)

    deepface_results = RESULTS / "deepface"

    deepface_results.mkdir(
        exist_ok=True
    )

    try:

        result = run_deepface(
            image_path,
            deepface_results
        )

        return result

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )


# =========================================================
# FACENET
# =========================================================

@app.post("/api/facenet")
async def facenet(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...)
):

    try:

        path1 = await save_upload(image1)
        path2 = await save_upload(image2)

        # Make sure both files were actually created
        if not path1.exists():
            raise ValueError("Image 1 could not be saved.")

        if not path2.exists():
            raise ValueError("Image 2 could not be saved.")

        # Make sure OpenCV can read both files
        test1 = cv2.imread(str(path1))
        test2 = cv2.imread(str(path2))

        if test1 is None:
            raise ValueError(
                f"OpenCV could not read Image 1: {path1}"
            )

        if test2 is None:
            raise ValueError(
                f"OpenCV could not read Image 2: {path2}"
            )

        return run_facenet(
            path1,
            path2
        )

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )
    