import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Algorithms from "./pages/Algorithms";
import TemplateMatching from "./pages/TemplateMatching";
import ViolaJones from "./pages/ViolaJones";
import DeepFace from "./pages/DeepFace";
import FaceNet from "./pages/FaceNet";
import About from "./pages/About";

export default function App() {
  return (
    <div className="app-shell">
      <div className="ambient ambient-coral" />
      <div className="ambient ambient-purple" />
      <div className="ambient ambient-blue" />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/template-matching" element={<TemplateMatching />} />
          <Route path="/viola-jones" element={<ViolaJones />} />
          <Route path="/deepface" element={<DeepFace />} />
          <Route path="/facenet" element={<FaceNet />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}
