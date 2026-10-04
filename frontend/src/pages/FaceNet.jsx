import { useState } from "react";
import ToolLayout from "./ToolLayout";

const API = "http://localhost:8000";

export default function FaceNet() {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    if (!file || !file2) return;
    setLoading(true);
    setResult(null);
    const form = new FormData();
    form.append("image1", file);
    form.append("image2", file2);
    try {
      const res = await fetch(`${API}/api/facenet`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Request failed");
      setResult({ data });
    } catch (e) {
      setResult({ data: { error: e.message, note: "Install the FaceNet-compatible backend dependency to enable embeddings." } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      eyebrow="04 · Face recognition"
      title="FaceNet"
      subtitle="Turn faces into embeddings and compare them in vector space."
      description="FaceNet maps aligned faces into an embedding space where distance can be used to compare identities."
      steps={["Two faces", "Detect", "Align", "Embedding", "Distance"]}
      file={file}
      setFile={setFile}
      loading={loading}
      onRun={run}
      runLabel="Compare embeddings"
      result={result}
      resultTitle="Embedding comparison"
    >
      <div className="workspace-card">
        <div className="workspace-top">
          <div>
            <span className="eyebrow">02 · Comparison</span>
            <h2>Reference face</h2>
          </div>
        </div>
        <div className="mini-upload">
          <input id="facenet-second" type="file" accept="image/*" onChange={(e) => setFile2(e.target.files?.[0])} />
          <label htmlFor="facenet-second">{file2 ? `✓ ${file2.name}` : "Choose the second face"}</label>
        </div>
        <div className="embedding-preview">
          <div className="embedding-bars">
            {Array.from({ length: 28 }).map((_, i) => <span key={i} style={{ height: `${25 + ((i * 19) % 65)}%` }} />)}
          </div>
          <div>
            <span className="eyebrow">Concept preview</span>
            <p>A real run will return the model embedding and distance between the two faces.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
