# VisionTrace 🔍

### Interactive Image & Video Analytics Platform

VisionTrace is an interactive computer vision laboratory developed for an Image & Video Analytics (IVA) project.

The goal is simple:

> **Don't just show the answer. Show the journey.**

The platform demonstrates four important computer-vision / facial-analysis techniques with a visual processing pipeline.

## Modules

- **Template Matching** — locate a known template inside an image.
- **Viola–Jones** — classical Haar-cascade face detection.
- **DeepFace** — deep facial analysis and representation.
- **FaceNet** — face embeddings and distance-based comparison.

## Stack

- React + Vite
- Custom CSS UI
- Framer Motion
- FastAPI
- Python
- OpenCV
- DeepFace / FaceNet adapter

## Project structure

```text
visiontrace/
├── frontend/
├── backend/
├── assets/
├── .gitignore
└── README.md
```

## Run locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8000`

## Notes

DeepFace / FaceNet dependencies are significantly heavier than OpenCV. The application keeps those modules separated so the lighter computer-vision modules can be developed and tested independently.

## Academic purpose

Created as an Image & Video Analytics assignment to connect algorithm theory with practical, visual demonstrations.
