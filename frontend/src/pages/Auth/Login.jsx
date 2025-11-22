import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard";
import { loginUser } from "../../services/auth";
import "./Login.css";

export default function Login({ setUsername }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await loginUser(form.email, form.password);

    if (res.ok) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("username", res.username);
      setUsername(res.username);
      navigate("/");
    } else {
      setMessage(res.error || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <AuthCard>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Please sign in to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            required
          />

          <button className="auth-btn" type="submit">
            Log In
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
