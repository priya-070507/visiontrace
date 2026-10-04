import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AlgorithmCard({ number, icon, title, description, tag, to, accent = "purple" }) {
  return (
    <Link to={to} className={`algorithm-card ${accent}`}>
      <div className="card-top">
        <span className="number">{number}</span>
        <span className="card-icon">{icon}</span>
      </div>
      <div className="card-body">
        <span className="eyebrow">{tag}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="card-arrow"><ArrowUpRight size={19} /></span>
    </Link>
  );
}
