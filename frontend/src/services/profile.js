const API = "http://localhost:5000/api";

export async function getMyProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function updateProfile(form) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/user/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (res.ok) {
    return { ok: true, username: data.username };
  }

  return { ok: false, error: data.error };
}
