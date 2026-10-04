# VisionTrace

### Image & Video Analytics — Interactive Algorithm Visualization Platform

VisionTrace is an interactive web-based Image & Video Analytics platform that demonstrates and visualizes fundamental computer vision and face analysis algorithms through a simple, modern interface.

Instead of only displaying the final output, VisionTrace presents the processing workflow step-by-step:

**Input → Preprocessing → Algorithm → Intermediate Visualization → Final Result → Explanation**

---

## 🚀 Live Demo

**[Open VisionTrace Live Demo](YOUR_DEPLOYED_LINK_HERE)**

> Replace `YOUR_DEPLOYED_LINK_HERE` with the deployed application URL.

---

## 📌 Project Overview

Computer vision algorithms can often feel difficult to understand when they are presented only as mathematical concepts or code.

VisionTrace was developed to make these algorithms easier to understand by providing an interactive environment where users can upload images and observe how different Image & Video Analytics techniques process them.

The platform currently demonstrates four algorithms:

- Template Matching
- Viola–Jones
- DeepFace
- FaceNet

Each algorithm has its own dedicated interface with input controls, processing stages, visual outputs, result metrics, and explanations.

---

## ✨ Key Features

- 🖼️ Image upload and processing
- 🔬 Step-by-step algorithm visualization
- 📊 Intermediate processing results
- 🎯 Final result visualization
- 🧠 AI-based facial analysis
- 👤 Face detection and recognition
- 📈 Similarity measurement
- 💡 Algorithm explanations
- ⚡ React-based interactive frontend
- 🚀 FastAPI backend for image processing
- 🎨 Modern responsive user interface

---

# 🧠 Algorithms Implemented

## 1. Template Matching

Template Matching is used to locate a smaller template image inside a larger source image.

### Workflow

```text
Input Image
     ↓
Template Image
     ↓
Grayscale Conversion
     ↓
Template Matching
     ↓
Similarity Map
     ↓
Best Match Detection
     ↓
Bounding Box + Similarity Score
```

### Output

VisionTrace displays:

- Original image
- Grayscale representation
- Template image
- Similarity heatmap
- Detected matching region
- Similarity score

The implementation uses OpenCV template matching with normalized correlation.

---

## 2. Viola–Jones

The Viola–Jones algorithm is a classical object detection approach widely used for real-time face detection.

VisionTrace uses Haar Cascade-based face detection to demonstrate the detection process.

### Workflow

```text
Input Image
     ↓
Grayscale Conversion
     ↓
Haar Feature Representation
     ↓
Integral Image
     ↓
Cascade Detection
     ↓
Detected Faces
```

### Output

VisionTrace displays:

- Original image
- Grayscale image
- Haar feature visualization
- Integral image visualization
- Face detection result
- Detected face bounding boxes

---

## 3. DeepFace

DeepFace is used for facial analysis and provides high-level information about detected faces.

VisionTrace uses DeepFace to perform facial analysis on uploaded images.

### Workflow

```text
Input Image
     ↓
Face Detection
     ↓
Face Alignment
     ↓
Face Extraction
     ↓
DeepFace Analysis
     ↓
Facial Attributes
```

### Analysis

The application can display information such as:

- Number of detected faces
- Age estimation
- Gender estimation
- Emotion analysis
- Dominant race category
- Face regions

Intermediate visualizations show the detected faces and extracted facial regions.

---

## 4. FaceNet

FaceNet is a deep learning-based face recognition approach that represents faces as numerical embeddings.

VisionTrace uses FaceNet to compare two uploaded face images.

### Workflow

```text
Image 1 ──→ Face Detection ──→ Face Crop ──→ Embedding ──┐
                                                          │
                                                          ↓
                                                    Cosine Similarity
                                                          ↑
                                                          │
Image 2 ──→ Face Detection ──→ Face Crop ──→ Embedding ──┘
                                                          ↓
                                                  Similarity + Verdict
```

### Output

VisionTrace displays:

- Image 1
- Image 2
- Face detection results
- Extracted face regions
- Embedding visualization
- Similarity score
- Same Person / Different People verdict

The current implementation uses cosine similarity to compare the generated face embeddings.

---

# 🔄 VisionTrace Processing Pipeline

Every algorithm follows a structured processing pipeline:

```text
┌───────────────┐
│     INPUT     │
│ Image Upload  │
└───────┬───────┘
        ↓
┌───────────────┐
│ PREPROCESSING │
│ Resize / Gray │
│ / Alignment   │
└───────┬───────┘
        ↓
┌───────────────┐
│   ALGORITHM   │
│ Computer      │
│ Vision Model  │
└───────┬───────┘
        ↓
┌─────────────────────┐
│ INTERMEDIATE RESULT │
│ Visual Processing   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    FINAL RESULT     │
│ Score / Detection   │
│ / Analysis          │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    EXPLANATION      │
│ Understand the      │
│ processing stages   │
└─────────────────────┘
```

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │        USER          │
                    │  Uploads an Image    │
                    └──────────┬───────────┘
                               │
                               ↓
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │                      │
                    │ • UI                 │
                    │ • Upload Interface   │
                    │ • Results            │
                    │ • Visualizations     │
                    └──────────┬───────────┘
                               │
                          REST API
                               │
                               ↓
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │                      │
                    │ • Upload Handling    │
                    │ • API Endpoints      │
                    │ • Algorithm Routing  │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ↓                 ↓                 ↓
       ┌───────────┐     ┌────────────┐    ┌────────────┐
       │ OpenCV    │     │ DeepFace   │    │  FaceNet   │
       │ Algorithms│     │ Analysis   │    │ Embeddings │
       └───────────┘     └────────────┘    └────────────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ↓
                    ┌──────────────────────┐
                    │  Processed Results   │
                    │  + Visualizations    │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │   Result Display     │
                    └──────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS

## Backend

- Python
- FastAPI
- Uvicorn

## Computer Vision & AI

- OpenCV
- NumPy
- DeepFace
- TensorFlow
- FaceNet
- Keras-FaceNet
- Scikit-learn

---

# 📁 Project Structure

```text
visiontrace/
│
├── .gitignore
├── README.md
│
├── assets/
│   └── screenshots/
│
├── backend/
│   │
│   ├── algorithms/
│   │   ├── __init__.py
│   │   ├── template_matching.py
│   │   ├── viola_jones.py
│   │   ├── deepface_analysis.py
│   │   └── facenet.py
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   └── image_utils.py
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   │
│   ├── results/
│   │   └── .gitkeep
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    │
    ├── public/
    │
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── AlgorithmCard.jsx
    │   │   ├── ProcessTimeline.jsx
    │   │   ├── ImageUploader.jsx
    │   │   └── HeroIllustration.jsx
    │   │
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Algorithms.jsx
    │   │   ├── About.jsx
    │   │   ├── ToolLayout.jsx
    │   │   ├── TemplateMatching.jsx
    │   │   ├── ViolaJones.jsx
    │   │   ├── DeepFace.jsx
    │   │   └── FaceNet.jsx
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

# ⚙️ Installation

## Prerequisites

Make sure the following are installed:

- Python 3.11
- Node.js
- npm

Python 3.11 is recommended because the facial analysis dependencies used by the backend require a compatible Python environment.

---

# 🔧 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### API Health Check

Open:

```text
http://127.0.0.1:8000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "VisionTrace API"
}
```

---

# 💻 Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔗 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Backend health check |
| `/api/template-matching` | POST | Template matching |
| `/api/viola-jones` | POST | Viola–Jones face detection |
| `/api/deepface` | POST | DeepFace facial analysis |
| `/api/facenet` | POST | FaceNet face verification |
| `/results/...` | GET | Access processed result images |

---

# 🎯 Learning Objective

VisionTrace is designed to bridge the gap between theoretical Image & Video Analytics concepts and practical implementation.

Instead of treating algorithms as black boxes, the platform allows users to observe:

- What enters the algorithm
- How the image is preprocessed
- How the algorithm operates
- What intermediate representations are produced
- What the final output means

This makes VisionTrace useful as both a learning platform and an interactive computer vision demonstration tool.

---

# 🔮 Future Enhancements

Potential future improvements include:

- Video input support
- Real-time webcam processing
- Additional object detection algorithms
- Object tracking
- Image segmentation
- Edge detection demonstrations
- More face recognition models
- Performance comparison between algorithms
- Processing-time benchmarking
- Exportable analysis reports
- Cloud deployment and scalable processing

---

# 👥 Project

**VisionTrace**

An academic Image & Video Analytics project focused on making computer vision algorithms interactive, visual, and easier to understand.

---

## ⭐ Algorithms

**Template Matching · Viola–Jones · DeepFace · FaceNet**

---

> Built for learning, experimentation, and practical understanding of Image & Video Analytics.
