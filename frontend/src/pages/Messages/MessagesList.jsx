import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MessagesList.css";

const API = import.meta.env.VITE_API_URL;

export default function MessagesList() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setMe(data))
        .catch(() => {});
    }

    fetch(`${API}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => {});
  }, []);

  return (
    <div className="messages-list-page">
      <h1 className="messages-title">Select a User to Message</h1>

      <div className="messages-user-list">
        {users
          .filter((u) => u.id !== me?.id)
          .map((u) => (
            <Link
              key={u.id}
              to={`/messages/${u.id}`}
              className="messages-user-item"
            >
              {u.username}
            </Link>
          ))}
      </div>
    </div>
  );
}