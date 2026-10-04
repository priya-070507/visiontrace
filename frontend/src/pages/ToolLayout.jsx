import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import ProcessTimeline from "../components/ProcessTimeline";
import ImageUploader from "../components/ImageUploader";

export default function ToolLayout({
  eyebrow,
  title,
  subtitle,
  description,
  steps,
  children,
  onRun,
  loading = false,
  runLabel = "Run analysis",
  file,
  setFile,
  result,
  resultTitle = "Result"
}) {
  const preview = file ? URL.createObjectURL(file) : null;
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="page tool-page">
      <div className="tool-header">
        <Link to="/algorithms" className="back-link"><ArrowLeft size={15} /> Algorithms</Link>
        <div className="tool-heading">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="tool-description">
          <Info size={17} />
          <span>{description}</span>
        </div>
      </div>

      <div className="tool-layout">
        <aside className="tool-sidebar">
          <span className="eyebrow">Processing pipeline</span>
          <ProcessTimeline steps={steps} active={file ? steps.length - 1 : 0} />
          <button className="reset-button" onClick={() => setFile(null)} disabled={!file}>
            <RotateCcw size={15} /> Reset
          </button>
        </aside>

        <section className="tool-workspace">
          <div className="workspace-card">
            <div className="workspace-top">
              <div>
                <span className="eyebrow">01 · Input</span>
                <h2>Provide an image</h2>
              </div>
              <span className="status-badge">{file ? "Ready" : "Waiting"}</span>
            </div>
            <ImageUploader
              label="Drop your image here"
              hint="PNG, JPG or WEBP · Click to browse"
              onChange={setFile}
              preview={preview}
            />
          </div>

          {children}

          <div className="run-bar">
            <div>
              <span className="eyebrow">Ready to process</span>
              <strong>{file ? file.name : "Choose an image first"}</strong>
            </div>
            <button className="primary-button" disabled={!file || loading} onClick={onRun}>
              {loading ? "Processing..." : runLabel} <ArrowRight size={17} />
            </button>
          </div>

          {result && (
            <div className="result-card">
              <div className="workspace-top">
                <div>
                  <span className="eyebrow">Final output</span>
                  <h2>{resultTitle}</h2>
                </div>
                <span className="status-badge success">Complete</span>
              </div>
              {result.image && <img className="result-image" src={result.image} alt="Processed result" />}
              <pre className="result-json">{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}

          {showInfo && (
            <div className="learning-note">
              <Info size={18} />
              <div>
                <strong>Why this step matters</strong>
                <p>VisionTrace keeps the explanation beside the experiment so you can connect the theory with the output.</p>
              </div>
              <button onClick={() => setShowInfo(false)}>×</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
