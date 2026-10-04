import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  MapPin,
  Target,
  UploadCloud
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API = "http://localhost:8000";

const pipeline = [
  "Input image",
  "Grayscale",
  "Template",
  "Similarity map",
  "Best match"
];

export default function TemplateMatching() {
  const [image, setImage] = useState(null);
  const [template, setTemplate] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [templatePreview, setTemplatePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleImage = (file) => {
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleTemplate = (file) => {
    if (!file) return;

    setTemplate(file);
    setTemplatePreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const runMatching = async () => {
    if (!image || !template) {
      setError("Please select both a main image and a template.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();

    formData.append("image", image);
    formData.append("template", template);

    try {
      const response = await fetch(
        `${API}/api/template-matching`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Template matching failed."
        );
      }

      setResult(data);

    } catch (err) {
      setError(
        err.message ||
        "Could not connect to the VisionTrace backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page template-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="tool-header">

        <Link
          to="/algorithms"
          className="back-link"
        >
          <ArrowLeft size={15} />
          Algorithms
        </Link>

        <div className="tool-heading">
          <span className="eyebrow">
            01 · Pattern detection
          </span>

          <h1>
            Template Matching
          </h1>

          <p>
            Find where a known visual pattern appears
            inside a larger image.
          </p>
        </div>

        <div className="tool-description">
          <Target size={17} />

          <span>
            The template is moved across the source image
            and a similarity score is calculated at each
            position.
          </span>
        </div>

      </section>


      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}

      <div className="template-workspace">

        {/* -------------------------------------------------
            LEFT PIPELINE
        -------------------------------------------------- */}

        <aside className="template-sidebar">

          <span className="eyebrow">
            Processing pipeline
          </span>

          <div className="template-pipeline">

            {pipeline.map((step, index) => {

              const completed =
                result
                  ? true
                  : index === 0 && image;

              return (
                <div
                  className="pipeline-item"
                  key={step}
                >

                  <div
                    className={
                      `pipeline-number ${
                        completed ? "completed" : ""
                      }`
                    }
                  >
                    {completed ? (
                      <Check size={13} />
                    ) : (
                      `0${index + 1}`
                    )}
                  </div>

                  <div className="pipeline-content">

                    <span>
                      STEP {index + 1}
                    </span>

                    <strong>
                      {step}
                    </strong>

                  </div>

                </div>
              );
            })}

          </div>

          <div className="method-card">

            <span>
              METHOD
            </span>

            <strong>
              TM_CCOEFF_NORMED
            </strong>

            <p>
              Higher values indicate stronger
              similarity.
            </p>

          </div>

        </aside>


        {/* -------------------------------------------------
            RIGHT CONTENT
        -------------------------------------------------- */}

        <main className="template-content">

          {/* =================================================
              INPUT SECTION
          ================================================== */}

          <section className="template-card">

            <div className="template-section-heading">

              <div>
                <span className="eyebrow">
                  01 · Input
                </span>

                <h2>
                  Prepare your images
                </h2>
              </div>

              <span className="status-badge">
                {image && template
                  ? "Ready"
                  : "Waiting"}
              </span>

            </div>


            <div className="input-grid">

              {/* MAIN IMAGE */}

              <UploadPanel
                title="Main image"
                description="The image to search"
                preview={imagePreview}
                onFile={handleImage}
              />


              {/* TEMPLATE */}

              <UploadPanel
                title="Template"
                description="The pattern to find"
                preview={templatePreview}
                onFile={handleTemplate}
              />

            </div>

          </section>


          {/* =================================================
              EXPLANATION
          ================================================== */}

          <section className="template-card explanation-card">

            <div className="template-section-heading">

              <div>
                <span className="eyebrow">
                  02 · How it works
                </span>

                <h2>
                  Slide. Compare. Locate.
                </h2>
              </div>

            </div>

            <div className="matching-flow">

              <FlowItem
                number="01"
                title="Slide"
                text="The template moves across the image."
              />

              <ArrowRight className="flow-arrow" />

              <FlowItem
                number="02"
                title="Compare"
                text="Pixel patterns are compared at each location."
              />

              <ArrowRight className="flow-arrow" />

              <FlowItem
                number="03"
                title="Score"
                text="Each location receives a similarity value."
              />

              <ArrowRight className="flow-arrow" />

              <FlowItem
                number="04"
                title="Locate"
                text="The highest score becomes the best match."
              />

            </div>

          </section>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="template-error">
              {error}
            </div>

          )}


          {/* =================================================
              RUN BUTTON
          ================================================== */}

          <div className="template-run-bar">

            <div>

              <span className="eyebrow">
                Ready to process
              </span>

              <strong>
                {image && template
                  ? "Both images are ready."
                  : "Choose both images first."}
              </strong>

            </div>

            <button
              className="primary-button"
              disabled={
                !image ||
                !template ||
                loading
              }
              onClick={runMatching}
            >

              {loading
                ? "Analyzing..."
                : "Find match"}

              <ArrowRight size={17} />

            </button>

          </div>


          {/* =================================================
              RESULTS
          ================================================== */}

          {result && (

            <motion.section
              className="template-results"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
            >

              {/* RESULT HEADER */}

              <div className="template-section-heading">

                <div>

                  <span className="eyebrow">
                    03 · Analysis complete
                  </span>

                  <h2>
                    See what the algorithm found
                  </h2>

                </div>

                <span className="status-badge success">
                  Complete
                </span>

              </div>


              {/* RESULT METRICS */}

              <div className="result-metrics">

                <Metric
                  label="Match score"
                  value={`${result.match_percentage}%`}
                />

                <Metric
                  label="Location"
                  value={`(${result.location.x}, ${result.location.y})`}
                />

                <Metric
                  label="Method"
                  value="Normalized correlation"
                />

              </div>


              {/* =================================================
                  PROCESSING STAGES
              ================================================== */}

              <div className="stages-heading">

                <span className="eyebrow">
                  Intermediate results
                </span>

                <p>
                  These images are generated by the
                  actual OpenCV processing pipeline.
                </p>

              </div>


              <div className="stage-grid">

                <StageCard
                  number="01"
                  title="Original image"
                  description="The source image before processing."
                  src={`${API}${result.stages.original}`}
                />

                <StageCard
                  number="02"
                  title="Grayscale"
                  description="The source image converted to intensity values."
                  src={`${API}${result.stages.grayscale}`}
                />

                <StageCard
                  number="03"
                  title="Template"
                  description="The reference pattern being searched for."
                  src={`${API}${result.stages.template}`}
                />

                <StageCard
                  number="04"
                  title="Similarity map"
                  description="Brighter regions represent stronger matches."
                  src={`${API}${result.stages.similarity_map}`}
                  heatmap
                />

              </div>


              {/* =================================================
                  FINAL RESULT
              ================================================== */}

              <div className="final-result">

                <div className="final-result-heading">

                  <div>

                    <span className="eyebrow">
                      05 · Final result
                    </span>

                    <h3>
                      Best matching location
                    </h3>

                  </div>

                  <div className="match-score">

                    <span>
                      MATCH
                    </span>

                    <strong>
                      {result.match_percentage}%
                    </strong>

                  </div>

                </div>


                <div className="final-image-wrapper">

                  <img
                    src={`${API}${result.stages.result}`}
                    alt="Template matching result"
                  />

                  <div className="result-location">

                    <MapPin size={15} />

                    <span>
                      x: {result.location.x}
                      &nbsp;&nbsp;
                      y: {result.location.y}
                    </span>

                  </div>

                </div>

              </div>


              {/* =================================================
                  ALGORITHM EXPLANATION
              ================================================== */}

              <div className="algorithm-explanation">

                <span className="eyebrow">
                  What happened?
                </span>

                <div className="explanation-list">

                  <Explanation
                    number="01"
                    title="Grayscale conversion"
                    text={result.explanation.grayscale}
                  />

                  <Explanation
                    number="02"
                    title="Template comparison"
                    text={result.explanation.matching}
                  />

                  <Explanation
                    number="03"
                    title="Similarity calculation"
                    text={result.explanation.similarity}
                  />

                  <Explanation
                    number="04"
                    title="Best match"
                    text={result.explanation.result}
                  />

                </div>

              </div>

            </motion.section>

          )}

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   UPLOAD PANEL
========================================================= */

function UploadPanel({
  title,
  description,
  preview,
  onFile
}) {

  return (
    <label className="tm-upload-panel">

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) =>
          onFile(e.target.files?.[0])
        }
      />

      <div className="upload-panel-header">

        <div>

          <strong>
            {title}
          </strong>

          <span>
            {description}
          </span>

        </div>

        <ImageIcon size={18} />

      </div>


      {preview ? (

        <div className="tm-preview">

          <img
            src={preview}
            alt={title}
          />

          <span className="change-image">
            Change image
          </span>

        </div>

      ) : (

        <div className="tm-empty">

          <div className="upload-icon">
            <UploadCloud size={22} />
          </div>

          <strong>
            Drop image here
          </strong>

          <span>
            or click to browse
          </span>

        </div>

      )}

    </label>
  );
}


/* =========================================================
   FLOW ITEM
========================================================= */

function FlowItem({
  number,
  title,
  text
}) {

  return (
    <div className="flow-item">

      <span>
        {number}
      </span>

      <strong>
        {title}
      </strong>

      <p>
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value
}) {

  return (
    <div className="result-metric">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


/* =========================================================
   STAGE CARD
========================================================= */

function StageCard({
  number,
  title,
  description,
  src,
  heatmap = false
}) {

  return (
    <div className="stage-card">

      <div className="stage-number">
        {number}
      </div>

      <div className="stage-image">

        <img
          src={src}
          alt={title}
          className={heatmap ? "heatmap-image" : ""}
        />

      </div>

      <div className="stage-info">

        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   EXPLANATION
========================================================= */

function Explanation({
  number,
  title,
  text
}) {

  return (
    <div className="explanation-item">

      <span>
        {number}
      </span>

      <div>

        <strong>
          {title}
        </strong>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}