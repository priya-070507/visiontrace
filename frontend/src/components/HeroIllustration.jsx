import { motion } from "framer-motion";
import { ScanFace, Sparkles, Grid3X3, Activity } from "lucide-react";

export default function HeroIllustration() {
  return (
    <div className="hero-visual">
      <div className="visual-cloud" />
      <motion.div className="floating-chip chip-one" animate={{ y: [0, -9, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <ScanFace size={16} /> Face detected
      </motion.div>
      <motion.div className="floating-chip chip-two" animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
        <Sparkles size={15} /> AI analysis
      </motion.div>

      <div className="monitor">
        <div className="monitor-top">
          <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
          <span className="monitor-label">visiontrace / live</span>
        </div>
        <div className="monitor-screen">
          <div className="scan-grid" />
          <div className="face-placeholder">
            <div className="face-head">
              <div className="face-eye left" />
              <div className="face-eye right" />
              <div className="face-mouth" />
            </div>
            <div className="face-box">FACE 01 · 97.2%</div>
          </div>
          <div className="screen-stats">
            <div><span>Pipeline</span><b>04 stages</b></div>
            <div><span>Latency</span><b>42 ms</b></div>
          </div>
        </div>
      </div>

      <div className="visual-base">
        <div className="base-pill"><Grid3X3 size={18} /></div>
        <div className="base-line" />
        <div className="base-pill"><Activity size={18} /></div>
      </div>
    </div>
  );
}
