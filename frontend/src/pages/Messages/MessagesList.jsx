import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MessagesList.css";

export default function MessagesList() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setMe(data));
    }

    fetch("http://localhost:5000/api/users")
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
