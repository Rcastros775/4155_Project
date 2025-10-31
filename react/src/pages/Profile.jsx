import { useState, useEffect } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/me", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({ username: data.username, password: "" });
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const res = await fetch("http://localhost:5000/api/user/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Profile updated!");
      localStorage.setItem("username", data.username);
      window.location.reload();
    } else {
      alert("❌ " + data.error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>
        <p className="profile-subtitle">Manage your account details</p>

        {!editMode ? (
          <>
            <div className="profile-info">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Username:</strong> {user.username}</p>
            </div>

            <button className="profile-btn-edit" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <div className="profile-edit-form">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="profile-input"
              placeholder="New username"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="profile-input"
              placeholder="New password (optional)"
            />

            <button className="profile-btn-save" onClick={handleSave}>Save Changes</button>
            <button className="profile-btn-cancel" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

