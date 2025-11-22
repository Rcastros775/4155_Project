import { Link } from "react-router-dom";
import studentsBG from "../../assets/Students.png";
import "./Home.css";

export default function Home() {
  return (
    <div className="home" style={{ "--home-bg": `url(${studentsBG})` }}>
      <section className="hero-banner">
        <h1>Niner Athletic Hub</h1>
        <p>Your all-in-one destination for Charlotte 49ers athletics.</p>

        <Link to="/events" className="events-btn">
          View Events
        </Link>
      </section>
    </div>
  );
}
