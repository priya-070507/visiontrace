import { useState } from "react";
import ToolLayout from "./ToolLayout";

const API = "http://localhost:8000";

export default function TemplateMatching() {
  const [file, setFile] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    if (!file || !template) return;
    setLoading(true);
    setResult(null);
    const form = new FormData();
    form.append("image", file);
    form.append("template", template);
    try {
      const res = await fetch(`${API}/api/template-matching`, { method: "POST", body: form });
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
      eyebrow="01 · Pattern detection"
      title="Template Matching"
      subtitle="Find a known visual pattern inside a larger image."
      description="The template is moved across the source image and a similarity score is calculated at each position."
      steps={["Input image", "Template", "Similarity map", "Best match", "Bounding box"]}
      file={file}
      setFile={setFile}
      loading={loading}
      onRun={run}
      runLabel="Find match"
      result={result}
      resultTitle="Template match"
    >
      <div className="workspace-card">
        <div className="workspace-top">
          <div>
            <span className="eyebrow">02 · Reference</span>
            <h2>Choose the template</h2>
          </div>
        </div>
        <div className="mini-upload">
          <input id="template-input" type="file" accept="image/*" onChange={(e) => setTemplate(e.target.files?.[0])} />
          <label htmlFor="template-input">{template ? `✓ ${template.name}` : "Choose template image"}</label>
        </div>
      </div>
    </ToolLayout>
  );
}
