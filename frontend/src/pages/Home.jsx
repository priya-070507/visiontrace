import { motion } from "framer-motion";
import { ArrowRight, Play, ScanSearch, BrainCircuit, Eye, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import HeroIllustration from "../components/HeroIllustration";
import AlgorithmCard from "../components/AlgorithmCard";

const algorithms = [
  {
    number: "01",
    icon: <ScanSearch size={22} />,
    title: "Template Matching",
    tag: "Pattern detection",
    description: "Locate a known template inside an image and visualize the similarity map and best match.",
    to: "/template-matching",
    accent: "coral"
  },
  {
    number: "02",
    icon: <Eye size={22} />,
    title: "Viola–Jones",
    tag: "Face detection",
    description: "Explore Haar features, integral images and cascade-based face detection.",
    to: "/viola-jones",
    accent: "purple"
  },
  {
    number: "03",
    icon: <BrainCircuit size={22} />,
    title: "DeepFace",
    tag: "Facial analysis",
    description: "Move from face detection to deep representations and verification.",
    to: "/deepface",
    accent: "blue"
  },
  {
    number: "04",
    icon: <ShieldCheck size={22} />,
    title: "FaceNet",
    tag: "Face recognition",
    description: "Turn faces into embeddings and compare identities using vector distance.",
    to: "/facenet",
    accent: "rose"
  }
];

export default function Home() {
  return (
    <div className="page">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="pill">
            <span className="pill-dot" /> Image & Video Analytics
          </div>
          <h1>See what happens<br /><em>inside</em> computer vision.</h1>
          <p className="hero-text">
            VisionTrace turns complex IVA algorithms into visual, interactive experiences —
            from the first pixel to the final prediction.
          </p>
          <div className="hero-actions">
            <Link to="/algorithms" className="primary-button">Explore algorithms <ArrowRight size={18} /></Link>
            <Link to="/about" className="secondary-button"><Play size={16} /> How it works</Link>
          </div>
          <div className="hero-meta">
            <span>4 interactive modules</span>
            <span className="meta-divider" />
            <span>Step-by-step visualization</span>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">The laboratory</span>
            <h2>Four algorithms.<br />One visual journey.</h2>
          </div>
          <p>Learn the theory, run the algorithm, inspect the intermediate stages, and understand the result.</p>
        </div>

        <div className="algorithm-grid">
          {algorithms.map((item) => <AlgorithmCard key={item.number} {...item} />)}
        </div>
      </section>

      <section className="story-section">
        <div className="story-card">
          <div>
            <span className="eyebrow">Our philosophy</span>
            <h2>Don't just show the answer.<br /><em>Show the journey.</em></h2>
          </div>
          <div className="story-pipeline">
            {["Input", "Preprocess", "Algorithm", "Visualize", "Result"].map((x, i) => (
              <div className="story-step" key={x}>
                <span>0{i + 1}</span>
                <b>{x}</b>
                {i < 4 && <ArrowRight size={15} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
