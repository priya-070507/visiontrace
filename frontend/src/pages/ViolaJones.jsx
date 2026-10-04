import { useState } from "react";
import ToolLayout from "./ToolLayout";

const API = "http://localhost:8000";

export default function ViolaJones() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scale, setScale] = useState(1.1);
  const [neighbors, setNeighbors] = useState(5);

  const run = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const form = new FormData();
    form.append("image", file);
    form.append("scale_factor", scale);
    form.append("min_neighbors", neighbors);
    try {
      const res = await fetch(`${API}/api/viola-jones`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResult({ image: `${API}${data.result_image}`, data });
    } catch (e) {
      setResult({ data: { error: e.message, note: "Start the FastAPI backend on port 8000." } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      eyebrow="02 · Classical face detection"
      title="Viola–Jones"
      subtitle="See how Haar features and a cascade turn pixels into face detections."
      description="This module uses OpenCV's Haar cascade implementation to demonstrate classical face detection."
      steps={["Input image", "Grayscale", "Haar features", "Cascade", "Face boxes"]}
      file={file}
      setFile={setFile}
      loading={loading}
      onRun={run}
      runLabel="Detect faces"
      result={result}
      resultTitle="Detection result"
    >
      <div className="workspace-card controls-card">
        <div className="workspace-top">
          <div>
            <span className="eyebrow">02 · Parameters</span>
            <h2>Cascade controls</h2>
          </div>
        </div>
        <div className="control-grid">
          <label>
            <span>Scale factor <b>{scale.toFixed(2)}</b></span>
            <input type="range" min="1.05" max="1.4" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          </label>
          <label>
            <span>Min neighbors <b>{neighbors}</b></span>
            <input type="range" min="1" max="10" step="1" value={neighbors} onChange={(e) => setNeighbors(Number(e.target.value))} />
          </label>
        </div>
        <div className="algorithm-explainer">
          <div className="explainer-step"><b>01</b><span>Haar-like features</span></div>
          <div className="explainer-arrow">→</div>
          <div className="explainer-step"><b>02</b><span>Integral image</span></div>
          <div className="explainer-arrow">→</div>
          <div className="explainer-step"><b>03</b><span>AdaBoost cascade</span></div>
        </div>
      </div>
    </ToolLayout>
  );
}
