import { useState } from "react";

const API_URL = "http://localhost:8000";


function UploadPanel({
  title,
  file,
  preview,
  onChange,
}) {

  return (
    <div className="fn-upload-panel">

      <div className="fn-upload-heading">

        <span>
          {title}
        </span>

        {file && (
          <small>
            {file.name}
          </small>
        )}

      </div>


      <label className="fn-dropzone">

        <input
          type="file"
          accept="image/*"
          onChange={onChange}
        />

        {preview ? (

          <img
            src={preview}
            alt={title}
          />

        ) : (

          <>

            <div className="fn-upload-icon">
              ↑
            </div>

            <strong>
              Upload image
            </strong>

            <span>
              JPG, JPEG or PNG
            </span>

          </>

        )}

      </label>

    </div>
  );
}


function Stage({
  number,
  title,
  image,
  description,
}) {

  return (

    <div className="fn-stage">

      <div className="fn-stage-number">
        {String(number).padStart(2, "0")}
      </div>

      <h3>
        {title}
      </h3>

      {image ? (

        <div className="fn-stage-image">

          <img
            src={image}
            alt={title}
          />

        </div>

      ) : (

        <div className="fn-stage-empty">
          Waiting for analysis
        </div>

      )}

      <p>
        {description}
      </p>

    </div>
  );
}


export default function FaceNet() {

  const [image1, setImage1] =
    useState(null);

  const [image2, setImage2] =
    useState(null);

  const [preview1, setPreview1] =
    useState(null);

  const [preview2, setPreview2] =
    useState(null);

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleImage1 = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    setImage1(file);

    setPreview1(
      URL.createObjectURL(file)
    );

    setResult(null);
    setError("");
  };


  const handleImage2 = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    setImage2(file);

    setPreview2(
      URL.createObjectURL(file)
    );

    setResult(null);
    setError("");
  };


  const getImageUrl = (path) => {

    if (!path) return "";

    return `${API_URL}${path}?t=${Date.now()}`;
  };


  const verifyFaces = async () => {

    if (!image1 || !image2) {

      setError(
        "Please upload both images."
      );

      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const formData =
        new FormData();

      formData.append(
        "image1",
        image1
      );

      formData.append(
        "image2",
        image2
      );

      const response = await fetch(
        `${API_URL}/api/facenet`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "FaceNet verification failed."
        );
      }

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


  return (

    <div className="fn-page">

      {/* HEADER */}

      <section className="fn-header">

        <div>

          <span className="fn-eyebrow">
            DEEP LEARNING • FACE VERIFICATION
          </span>

          <h1>
            Face<span>Net</span>
          </h1>

          <p>
            Compare two faces by transforming
            them into numerical embeddings and
            measuring their similarity.
          </p>

        </div>


        <div className="fn-header-badge">

          <div className="fn-badge-icon">
            ◉
          </div>

          <div>

            <strong>
              FaceNet
            </strong>

            <small>
              Facial embedding & verification
            </small>

          </div>

        </div>

      </section>


      {/* UPLOAD */}

      <section className="fn-workspace">

        <div className="fn-upload-card">

          <span className="fn-label">
            INPUT
          </span>

          <h2>
            Compare Two Images
          </h2>

          <p>
            Upload two images containing faces
            to perform FaceNet verification.
          </p>


          <div className="fn-upload-grid">

            <UploadPanel
              title="IMAGE 01"
              file={image1}
              preview={preview1}
              onChange={handleImage1}
            />

            <UploadPanel
              title="IMAGE 02"
              file={image2}
              preview={preview2}
              onChange={handleImage2}
            />

          </div>


          <button
            className="fn-verify-button"
            onClick={verifyFaces}
            disabled={
              !image1 ||
              !image2 ||
              loading
            }
          >

            {loading ? (

              <>
                <span className="fn-spinner"></span>
                Comparing faces...
              </>

            ) : (

              <>
                Verify Faces
                <span>→</span>
              </>

            )}

          </button>


          {error && (

            <div className="fn-error">
              {error}
            </div>

          )}

        </div>


        {/* EXPLANATION */}

        <div className="fn-info-card">

          <span className="fn-label">
            PIPELINE
          </span>

          <h2>
            How FaceNet Works
          </h2>

          <p>
            FaceNet maps faces into a compact
            numerical space where visually similar
            faces have similar embeddings.
          </p>


          <div className="fn-flow">

            <div>
              <span>01</span>
              <b>Detect</b>
            </div>

            <i></i>

            <div>
              <span>02</span>
              <b>Crop</b>
            </div>

            <i></i>

            <div>
              <span>03</span>
              <b>Embed</b>
            </div>

            <i></i>

            <div>
              <span>04</span>
              <b>Compare</b>
            </div>

          </div>


          <div className="fn-info-list">

            <div>

              <strong>
                Face Detection
              </strong>

              <p>
                Locates the largest visible face
                in each image.
              </p>

            </div>

            <div>

              <strong>
                Embedding
              </strong>

              <p>
                FaceNet converts each face into
                a 128-dimensional representation.
              </p>

            </div>

            <div>

              <strong>
                Similarity
              </strong>

              <p>
                The embeddings are compared using
                cosine similarity.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* VISUAL PIPELINE */}

      <section className="fn-pipeline-section">

        <div className="fn-heading">

          <div>

            <span className="fn-label">
              VISUAL PIPELINE
            </span>

            <h2>
              From Faces to Embeddings
            </h2>

          </div>

          {result && (

            <div
              className={
                result.same_person
                  ? "fn-match-badge"
                  : "fn-different-badge"
              }
            >

              {result.verification}

            </div>

          )}

        </div>


        <div className="fn-stage-grid">

          <Stage
            number={1}
            title="Face Detection — Image 1"
            image={
              result
                ? getImageUrl(
                    result.stages.image1_detection
                  )
                : null
            }
            description="Locate the face used for verification."
          />

          <Stage
            number={2}
            title="Face Detection — Image 2"
            image={
              result
                ? getImageUrl(
                    result.stages.image2_detection
                  )
                : null
            }
            description="Locate the corresponding face in the second image."
          />

          <Stage
            number={3}
            title="Face Cropping"
            image={
              result
                ? getImageUrl(
                    result.stages.image1_face
                  )
                : null
            }
            description="Extract and resize the detected face to 160 × 160."
          />

          <Stage
            number={4}
            title="FaceNet Embeddings"
            image={
              result
                ? getImageUrl(
                    result.stages.embedding
                  )
                : null
            }
            description="Generate and compare numerical facial embeddings."
          />

        </div>

      </section>


      {/* RESULT */}

      {result && (

        <section className="fn-results">

          <div className="fn-heading">

            <div>

              <span className="fn-label">
                VERIFICATION
              </span>

              <h2>
                FaceNet Result
              </h2>

            </div>

          </div>


          <div className="fn-result-grid">

            <div className="fn-result-images">

              <div>

                <span>
                  IMAGE 01
                </span>

                <img
                  src={getImageUrl(
                    result.stages.image1_face
                  )}
                  alt="Face 1"
                />

              </div>


              <div className="fn-vs">
                VS
              </div>


              <div>

                <span>
                  IMAGE 02
                </span>

                <img
                  src={getImageUrl(
                    result.stages.image2_face
                  )}
                  alt="Face 2"
                />

              </div>

            </div>


            <div className="fn-score-card">

              <span className="fn-label">
                SIMILARITY
              </span>

              <div className="fn-score">

                {result.similarity_percentage}
                <small>%</small>

              </div>

              <div className="fn-score-bar">

                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        result.similarity_percentage
                      )
                    )}%`
                  }}
                />

              </div>


              <div className="fn-verdict">

                <span>
                  VERDICT
                </span>

                <strong
                  className={
                    result.same_person
                      ? "fn-same"
                      : "fn-different"
                  }
                >

                  {result.verification}

                </strong>

              </div>


              <div className="fn-metrics">

                <div>

                  <span>
                    Embedding Size
                  </span>

                  <strong>
                    {result.embedding_dimension}D
                  </strong>

                </div>

                <div>

                  <span>
                    Threshold
                  </span>

                  <strong>
                    {result.threshold}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          <div className="fn-note">

            <div className="fn-note-icon">
              i
            </div>

            <div>

              <strong>
                Educational Note
              </strong>

              <p>
                FaceNet represents faces as numerical
                embeddings. In this demonstration,
                cosine similarity is used to compare
                those embeddings. The threshold is an
                educational demonstration value and
                should be calibrated for a real-world
                deployment.
              </p>

            </div>

          </div>

        </section>

      )}

    </div>
  );
}