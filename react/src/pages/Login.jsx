import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save JWT token + username so user stays logged in
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      setMessage(`✅ Welcome, ${data.username}!`);

      // OPTIONAL: Redirect user to homepage after login
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);

    } else {
      setMessage("❌ " + data.error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/><br/>
        <button type="submit">Log In</button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <a href="/register">Create one</a>
      </p>
    </div>
  );
}

