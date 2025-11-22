import "./GenderToggle.css";

export default function GenderToggle({ gender, onChange }) {
  return (
    <div className="gender-toggle">
      <button
        className={`gender-btn ${gender === "women" ? "active" : ""}`}
        onClick={() => onChange("women")}
      >
        Women’s
      </button>
      <button
        className={`gender-btn ${gender === "men" ? "active" : ""}`}
        onClick={() => onChange("men")}
      >
        Men’s
      </button>
    </div>
  );
}
