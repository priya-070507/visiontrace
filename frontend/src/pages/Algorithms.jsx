import { motion } from "framer-motion";
import { ScanSearch, Eye, BrainCircuit, ShieldCheck } from "lucide-react";
import AlgorithmCard from "../components/AlgorithmCard";

const data = [
  ["01", <ScanSearch size={24}/>, "Template Matching", "Pattern detection", "Find where a known visual template appears inside a larger image.", "/template-matching", "coral"],
  ["02", <Eye size={24}/>, "Viola–Jones", "Face detection", "Explore the classical Haar + AdaBoost + cascade pipeline.", "/viola-jones", "purple"],
  ["03", <BrainCircuit size={24}/>, "DeepFace", "Facial analysis", "Understand deep facial representations and verification.", "/deepface", "blue"],
  ["04", <ShieldCheck size={24}/>, "FaceNet", "Face recognition", "See how faces become embeddings and how distance becomes identity.", "/facenet", "rose"]
];

export default function Algorithms() {
  return (
    <div className="page algorithms-page">
      <section className="algorithms-panel">
        <section className="inner-hero">
          <span className="pill">
            <span className="pill-dot" /> Interactive laboratory
          </span>

          <h1>
            Choose an algorithm.<br />
            <em>Follow every step.</em>
          </h1>

          <p>
            Each module is built around the actual processing pipeline,
            not just the final output.
          </p>
        </section>

        <div className="algorithm-grid large">
          {data.map(([number, icon, title, tag, description, to, accent], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <AlgorithmCard
                number={number}
                icon={icon}
                title={title}
                tag={tag}
                description={description}
                to={to}
                accent={accent}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
