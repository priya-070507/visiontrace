import { useState } from "react";

const API_URL = "http://localhost:8000";

function StageCard({ number, title, image, description }) {
  return (
    <div className="vj-stage-card">
      <div className="vj-stage-number">
        {String(number).padStart(2, "0")}
      </div>

      <div className="vj-stage-content">
        <h3>{title}</h3>

        {image ? (
          <div className="vj-stage-image">
            <img src={image} alt={title} />
          </div>
        ) : (
          <div className="vj-stage-placeholder">
            Waiting for processing...
          </div>
        )}

        <p>{description}</p>
      </div>
    </div>
  );
}

export default function ViolaJones() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    setResult(null);
    setError("");
  };

  const processImage = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/api/viola-jones`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Viola-Jones processing failed."
        );
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while processing the image."
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";

    return `${API_URL}${path}?t=${Date.now()}`;
  };

  return (
    <div className="vj-page">

      {/* -------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------- */}

      <section className="vj-header">

        <div>
          <span className="vj-eyebrow">
            COMPUTER VISION • FACE DETECTION
          </span>

          <h1>
            Viola–Jones
            <span> Face Detection</span>
          </h1>

          <p>
            Explore how Haar-like features, integral images,
            and cascade classifiers work together to detect
            faces efficiently.
          </p>
        </div>

        <div className="vj-header-badge">
          <div className="vj-badge-icon">◉</div>

          <div>
            <strong>Haar Cascade</strong>
            <small>Real-time detection</small>
          </div>
        </div>

      </section>


      {/* -------------------------------------------------- */}
      {/* Upload + Process */}
      {/* -------------------------------------------------- */}

      <section className="vj-workspace">

        <div className="vj-upload-card">

          <div className="vj-card-heading">
            <div>
              <span className="vj-section-label">
                INPUT
              </span>

              <h2>Upload an Image</h2>

              <p>
                Choose an image containing one or more faces.
              </p>
            </div>
          </div>

          <label className="vj-dropzone">

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview ? (
              <div className="vj-preview-wrapper">
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="vj-upload-preview"
                />

                <div className="vj-preview-overlay">
                  Change image
                </div>
              </div>
            ) : (
              <>
                <div className="vj-upload-icon">
                  ↑
                </div>

                <strong>
                  Drop your image here
                </strong>

                <span>
                  or click to browse
                </span>

                <small>
                  JPG, JPEG, PNG
                </small>
              </>
            )}

          </label>

          <button
            className="vj-process-button"
            onClick={processImage}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className="vj-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                Detect Faces
                <span>→</span>
              </>
            )}
          </button>

          {error && (
            <div className="vj-error">
              {error}
            </div>
          )}

        </div>


        {/* -------------------------------------------------- */}
        {/* Algorithm information */}
        {/* -------------------------------------------------- */}

        <div className="vj-info-card">

          <span className="vj-section-label">
            ALGORITHM
          </span>

          <h2>
            How Viola–Jones Works
          </h2>

          <p>
            The Viola–Jones framework detects objects by
            evaluating simple Haar-like features using an
            integral image and a trained cascade classifier.
          </p>

          <div className="vj-mini-flow">

            <div>
              <span>01</span>
              <strong>Features</strong>
            </div>

            <div className="vj-flow-line"></div>

            <div>
              <span>02</span>
              <strong>Integral</strong>
            </div>

            <div className="vj-flow-line"></div>

            <div>
              <span>03</span>
              <strong>Cascade</strong>
            </div>

            <div className="vj-flow-line"></div>

            <div>
              <span>04</span>
              <strong>Detect</strong>
            </div>

          </div>

          <div className="vj-info-points">

            <div>
              <b>Haar-like Features</b>
              <span>
                Compare brightness between rectangular
                regions.
              </span>
            </div>

            <div>
              <b>Integral Image</b>
              <span>
                Makes rectangular-sum calculations extremely
                fast.
              </span>
            </div>

            <div>
              <b>Cascade Classifier</b>
              <span>
                Quickly rejects non-face regions and focuses
                computation on promising regions.
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* -------------------------------------------------- */}
      {/* Pipeline */}
      {/* -------------------------------------------------- */}

      <section className="vj-pipeline-section">

        <div className="vj-section-heading">

          <div>
            <span className="vj-section-label">
              VISUAL PIPELINE
            </span>

            <h2>
              From Image to Detection
            </h2>
          </div>

          {result && (
            <div className="vj-result-badge">
              {result.face_count}{" "}
              {result.face_count === 1
                ? "Face Detected"
                : "Faces Detected"}
            </div>
          )}

        </div>


        <div className="vj-pipeline">

          <StageCard
            number={1}
            title="Input Image"
            image={
              result
                ? getImageUrl(result.stages.original)
                : preview
            }
            description={
              result
                ? result.explanation.input
                : "The original image uploaded by the user."
            }
          />

          <StageCard
            number={2}
            title="Grayscale"
            image={
              result
                ? getImageUrl(result.stages.grayscale)
                : null
            }
            description={
              result
                ? result.explanation.grayscale
                : "The image is converted into intensity values."
            }
          />

          <StageCard
            number={3}
            title="Haar-like Features"
            image={
              result
                ? getImageUrl(result.stages.haar_features)
                : null
            }
            description={
              result
                ? result.explanation.haar_features
                : "Rectangular brightness patterns are used as visual features."
            }
          />

          <StageCard
            number={4}
            title="Integral Image"
            image={
              result
                ? getImageUrl(result.stages.integral_image)
                : null
            }
            description={
              result
                ? result.explanation.integral_image
                : "Cumulative pixel sums allow features to be calculated efficiently."
            }
          />

          <StageCard
            number={5}
            title="Cascade Classifier"
            image={
              result
                ? getImageUrl(result.stages.haar_features)
                : null
            }
            description={
              result
                ? result.explanation.cascade
                : "The trained Haar cascade evaluates candidate regions."
            }
          />

          <StageCard
            number={6}
            title="Detected Faces"
            image={
              result
                ? getImageUrl(result.stages.result)
                : null
            }
            description={
              result
                ? result.explanation.result
                : "Detected faces are highlighted with bounding boxes."
            }
          />

        </div>

      </section>


      {/* -------------------------------------------------- */}
      {/* Results */}
      {/* -------------------------------------------------- */}

      {result && (
        <section className="vj-results-section">

          <div className="vj-section-heading">

            <div>
              <span className="vj-section-label">
                RESULT
              </span>

              <h2>
                Detection Results
              </h2>
            </div>

          </div>


          <div className="vj-results-grid">

            {/* Main result */}

            <div className="vj-final-result-card">

              <div className="vj-final-image-wrapper">

                <img
                  src={getImageUrl(result.stages.result)}
                  alt="Viola-Jones detection result"
                />

                <div className="vj-image-tag">
                  FINAL OUTPUT
                </div>

              </div>

            </div>


            {/* Statistics */}

            <div className="vj-statistics-card">

              <span className="vj-section-label">
                ANALYSIS
              </span>

              <h3>
                Detection Summary
              </h3>

              <div className="vj-main-stat">

                <strong>
                  {result.face_count}
                </strong>

                <span>
                  {result.face_count === 1
                    ? "Face detected"
                    : "Faces detected"}
                </span>

              </div>


              <div className="vj-face-list">

                {result.faces.length > 0 ? (
                  result.faces.map((face) => (
                    <div
                      className="vj-face-item"
                      key={face.face_id}
                    >

                      <div className="vj-face-number">
                        {face.face_id}
                      </div>

                      <div>
                        <strong>
                          Face {face.face_id}
                        </strong>

                        <span>
                          Position: ({face.x}, {face.y})
                        </span>

                        <span>
                          Size: {face.width} × {face.height}
                        </span>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="vj-no-face">
                    No faces were detected.
                  </div>
                )}

              </div>

            </div>

          </div>


          {/* Educational note */}

          <div className="vj-note">

            <div className="vj-note-icon">
              i
            </div>

            <div>

              <strong>
                Educational Visualization
              </strong>

              <p>
                {result.educational_note}
              </p>

            </div>

          </div>

        </section>
      )}

    </div>
  );
}