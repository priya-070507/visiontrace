import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, ScanFace } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/algorithms", label: "Algorithms" },
  { to: "/about", label: "About" }
];

export default function Navbar() {
  return (
    <header className="site-nav">
      <Link to="/" className="brand">
        <span className="brand-mark"><ScanFace size={19} /></span>
        <span>Vision<span>Trace</span></span>
      </Link>

      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Link to="/algorithms" className="nav-cta">
        Get started <ArrowUpRight size={16} />
      </Link>
    </header>
  );
}
