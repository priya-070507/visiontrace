import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProcessTimeline({ steps, active = steps.length - 1 }) {
  return (
    <div className="process-timeline">
      {steps.map((step, index) => (
        <div className="process-step" key={step}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.08 }}
            className={`process-node ${index <= active ? "done" : ""}`}
          >
            {index < active ? <Check size={15} /> : <Circle size={10} fill="currentColor" />}
          </motion.div>
          <div>
            <span>0{index + 1}</span>
            <strong>{step}</strong>
          </div>
          {index !== steps.length - 1 && <div className={`process-line ${index < active ? "done" : ""}`} />}
        </div>
      ))}
    </div>
  );
}
