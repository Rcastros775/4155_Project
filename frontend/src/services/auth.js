const API = "http://localhost:5000/api";

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.error || "Login failed" };
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    return {
      ok: true,
      token: data.token,
      username: data.username,
    };
  } catch (err) {
    return { ok: false, error: "Network error" };
  }
}

export async function registerUser(username, email, password) {
  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: "Network error" };
  }
}
