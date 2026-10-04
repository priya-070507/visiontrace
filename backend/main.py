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

BASE = Path(__file__).resolve().parent
UPLOADS = BASE / "uploads"
RESULTS = BASE / "results"
UPLOADS.mkdir(exist_ok=True)
RESULTS.mkdir(exist_ok=True)

app = FastAPI(title="VisionTrace API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/results", StaticFiles(directory=RESULTS), name="results")


async def save_upload(file: UploadFile) -> Path:
    suffix = Path(file.filename or "").suffix.lower() or ".jpg"
    path = UPLOADS / f"{uuid.uuid4().hex}{suffix}"
    path.write_bytes(await file.read())
    return path


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "VisionTrace API"}


@app.post("/api/template-matching")
async def template_matching(image: UploadFile = File(...), template: UploadFile = File(...)):
    image_path = await save_upload(image)
    template_path = await save_upload(template)
    try:
        result = run_template_matching(image_path, template_path, RESULTS)
        return result
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/viola-jones")
async def viola_jones(
    image: UploadFile = File(...),
    scale_factor: float = Form(1.1),
    min_neighbors: int = Form(5),
):
    image_path = await save_upload(image)
    try:
        result = run_viola_jones(image_path, RESULTS, scale_factor, min_neighbors)
        return result
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/deepface")
async def deepface(image: UploadFile = File(...), action: str = Form("analyze")):
    image_path = await save_upload(image)
    try:
        return run_deepface(image_path, RESULTS, action)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/facenet")
async def facenet(image1: UploadFile = File(...), image2: UploadFile = File(...)):
    path1 = await save_upload(image1)
    path2 = await save_upload(image2)
    try:
        return run_facenet(path1, path2)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
