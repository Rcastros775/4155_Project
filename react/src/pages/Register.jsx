import { useState } from "react";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Registration successful! You can now log in.");
      setFormData({ username: "", email: "", password: "" });
    } else {
      setMessage("❌ " + (data.error || "Something went wrong."));
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <p className="register-subtitle">Join the Niner Athletic Hub</p>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="username"
            className="register-input"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            className="register-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            className="register-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="register-footer">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
