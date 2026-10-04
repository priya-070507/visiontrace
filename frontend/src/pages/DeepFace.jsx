import { useState } from "react";

const API_URL = "https://visiontrace-3vyk.onrender.com";

function StageCard({ number, title, image, description }) {
  return (
    <div className="df-stage-card">

      <div className="df-stage-number">
        {String(number).padStart(2, "0")}
      </div>

      <h3>{title}</h3>

      {image ? (
        <div className="df-stage-image">
          <img src={image} alt={title} />
        </div>
      ) : (
        <div className="df-stage-placeholder">
          Waiting for processing...
        </div>
      )}

      <p>{description}</p>

    </div>
  );
}


export default function DeepFace() {

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  const handleFileChange = (event) => {

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    setPreview(
      URL.createObjectURL(selectedFile)
    );

    setResult(null);

    setError("");
  };


  const processImage = async () => {

    if (!file) {

      setError(
        "Please upload an image first."
      );

      return;
    }

    setLoading(true);

    setError("");

    setResult(null);

    try {

      const formData = new FormData();

      formData.append(
        "image",
        file
      );

      const response = await fetch(
        `${API_URL}/api/deepface`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "DeepFace processing failed."
        );
      }

      const data =
        await response.json();

      setResult(data);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Something went wrong."
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

    <div className="df-page">

      {/* HEADER */}

      <section className="df-header">

        <div>

          <span className="df-eyebrow">
            DEEP LEARNING • FACE ANALYSIS
          </span>

          <h1>
            Deep<span>Face</span>
          </h1>

          <p>
            Explore facial analysis using DeepFace,
            from face detection and alignment to
            age, gender, emotion and race analysis.
          </p>

        </div>


        <div className="df-header-badge">

          <div className="df-badge-icon">
            ◉
          </div>

          <div>

            <strong>
              DeepFace
            </strong>

            <small>
              Facial analysis framework
            </small>

          </div>

        </div>

      </section>


      {/* WORKSPACE */}

      <section className="df-workspace">

        <div className="df-upload-card">

          <span className="df-section-label">
            INPUT
          </span>

          <h2>
            Upload an Image
          </h2>

          <p>
            Choose an image containing one or
            more visible faces.
          </p>


          <label className="df-dropzone">

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview ? (

              <div className="df-preview-wrapper">

                <img
                  src={preview}
                  alt="Preview"
                />

                <div className="df-preview-overlay">
                  Change image
                </div>

              </div>

            ) : (

              <>

                <div className="df-upload-icon">
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
            className="df-process-button"
            disabled={!file || loading}
            onClick={processImage}
          >

            {loading ? (

              <>
                <span className="df-spinner"></span>
                Analyzing...
              </>

            ) : (

              <>
                Analyze Faces
                <span>→</span>
              </>

            )}

          </button>


          {error && (

            <div className="df-error">
              {error}
            </div>

          )}

        </div>


        {/* INFO */}

        <div className="df-info-card">

          <span className="df-section-label">
            PIPELINE
          </span>

          <h2>
            How DeepFace Works
          </h2>

          <p>
            DeepFace provides a unified interface
            for modern facial analysis models and
            detectors.
          </p>


          <div className="df-mini-flow">

            <div>
              <span>01</span>
              <strong>Detect</strong>
            </div>

            <div className="df-flow-line"></div>

            <div>
              <span>02</span>
              <strong>Align</strong>
            </div>

            <div className="df-flow-line"></div>

            <div>
              <span>03</span>
              <strong>Analyze</strong>
            </div>

            <div className="df-flow-line"></div>

            <div>
              <span>04</span>
              <strong>Result</strong>
            </div>

          </div>


          <div className="df-info-points">

            <div>

              <b>
                Face Detection
              </b>

              <span>
                Finds facial regions in the
                uploaded image.
              </span>

            </div>


            <div>

              <b>
                Face Alignment
              </b>

              <span>
                Aligns detected faces before
                analysis.
              </span>

            </div>


            <div>

              <b>
                Facial Attributes
              </b>

              <span>
                Estimates age, gender, emotion
                and dominant race category.
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* PIPELINE */}

      <section className="df-pipeline-section">

        <div className="df-section-heading">

          <div>

            <span className="df-section-label">
              VISUAL PIPELINE
            </span>

            <h2>
              From Image to Analysis
            </h2>

          </div>


          {result && (

            <div className="df-result-badge">

              {result.face_count}

              {" "}

              {result.face_count === 1
                ? "Face Detected"
                : "Faces Detected"}

            </div>

          )}

        </div>


        <div className="df-pipeline">

          <StageCard
            number={1}
            title="Input Image"
            image={
              result
                ? getImageUrl(
                    result.stages.original
                  )
                : preview
            }
            description={
              result
                ? result.explanation.input
                : "Original image uploaded for analysis."
            }
          />


          <StageCard
            number={2}
            title="Face Detection"
            image={
              result
                ? getImageUrl(
                    result.stages.face_detection
                  )
                : null
            }
            description={
              result
                ? result.explanation.detection
                : "Detect facial regions in the image."
            }
          />


          <StageCard
            number={3}
            title="Face Alignment"
            image={
              result
                ? getImageUrl(
                    result.stages.face_crop
                  )
                : null
            }
            description={
              result
                ? result.explanation.alignment
                : "Extract and align a detected face."
            }
          />


          <StageCard
            number={4}
            title="DeepFace Analysis"
            image={
              result
                ? getImageUrl(
                    result.stages.face_crop
                  )
                : null
            }
            description={
              result
                ? result.explanation.analysis
                : "Deep learning models analyze facial attributes."
            }
          />

        </div>

      </section>


      {/* RESULTS */}

      {result && (

        <section className="df-results-section">

          <div className="df-section-heading">

            <div>

              <span className="df-section-label">
                ANALYSIS
              </span>

              <h2>
                Facial Analysis Results
              </h2>

            </div>

          </div>


          <div className="df-results-grid">

            <div className="df-final-result-card">

              <div className="df-final-image">

                <img
                  src={getImageUrl(
                    result.stages.face_detection
                  )}
                  alt="Detected faces"
                />

                <div className="df-image-tag">
                  DETECTED FACES
                </div>

              </div>

            </div>


            <div className="df-analysis-card">

              <span className="df-section-label">
                ATTRIBUTES
              </span>

              <h3>
                Face Analysis
              </h3>


              {result.analyses.map(
                (analysis) => (

                  <div
                    className="df-face-analysis"
                    key={analysis.face_id}
                  >

                    <div className="df-face-title">

                      <div className="df-face-number">
                        {analysis.face_id}
                      </div>

                      <strong>
                        Face {analysis.face_id}
                      </strong>

                    </div>


                    {analysis.error ? (

                      <div className="df-analysis-error">
                        Analysis failed for this face.
                      </div>

                    ) : (

                      <div className="df-attributes">

                        <div>
                          <span>Age</span>
                          <strong>
                            {analysis.age}
                          </strong>
                        </div>

                        <div>
                          <span>Gender</span>
                          <strong>
                            {analysis.gender}
                          </strong>
                        </div>

                        <div>
                          <span>Emotion</span>
                          <strong>
                            {analysis.emotion}
                          </strong>
                        </div>

                        <div>
                          <span>Race</span>
                          <strong>
                            {analysis.race}
                          </strong>
                        </div>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          </div>


          <div className="df-note">

            <div className="df-note-icon">
              i
            </div>

            <div>

              <strong>
                Important
              </strong>

              <p>
                DeepFace outputs are model-based
                estimates and may vary depending on
                image quality, lighting, pose and
                the selected underlying models.
              </p>

            </div>

          </div>

        </section>

      )}

    </div>

  );
}