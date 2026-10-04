import { useState } from "react";
import ToolLayout from "./ToolLayout";

const API = "http://localhost:8000";

export default function DeepFace() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [action, setAction] = useState("analyze");

  const run = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const form = new FormData();
    form.append("image", file);
    form.append("action", action);
    try {
      const res = await fetch(`${API}/api/deepface`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Request failed");
      setResult({ image: data.result_image ? `${API}${data.result_image}` : null, data });
    } catch (e) {
      setResult({ data: { error: e.message, note: "DeepFace is an optional heavy dependency. Install the backend requirements to enable it." } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      eyebrow="03 · Deep facial analysis"
      title="DeepFace"
      subtitle="Follow a face from pixels to a learned facial representation."
      description="DeepFace provides a practical interface to modern face detection, representation and facial analysis models."
      steps={["Input image", "Face detect", "Align", "Deep model", "Analysis"]}
      file={file}
      setFile={setFile}
      loading={loading}
      onRun={run}
      runLabel="Analyze face"
      result={result}
      resultTitle="DeepFace output"
    >
      <div className="workspace-card">
        <div className="workspace-top">
          <div>
            <span className="eyebrow">02 · Operation</span>
            <h2>Choose analysis mode</h2>
          </div>
        </div>
        <div className="mode-switch">
          {[
            ["analyze", "Facial analysis"],
            ["represent", "Representation"]
          ].map(([value, label]) => (
            <button key={value} className={action === value ? "selected" : ""} onClick={() => setAction(value)}>{label}</button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
