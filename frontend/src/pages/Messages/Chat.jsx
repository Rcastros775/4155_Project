import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchConversation, sendMessage } from "../../services/messages";
import "./Chat.css";

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setOtherUser(data))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const loadMessages = () => {
      fetchConversation(userId).then((res) => {
        if (!isMounted) return;
        if (res.ok) setMessages(res.messages);
      });
    };

    loadMessages();
    const intervalId = setInterval(loadMessages, 2000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;

    const res = await sendMessage(userId, text);
    if (res.ok) {
      setNewText("");
      const refreshed = await fetchConversation(userId);
      if (refreshed.ok) setMessages(refreshed.messages);
    }
  };

  const meId = currentUser?.id;

  if (loading) return <p className="chat-loading">Loading chat...</p>;

  return (
    <div className="chat-page">
      <div className="chat-card">
        <div className="chat-header">
          <button className="chat-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h2 className="chat-title">
            {otherUser ? otherUser.username : "Direct Messages"}
          </h2>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <p className="chat-empty">No messages yet. Say hi!</p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === meId;
              return (
                <div
                  key={msg.id}
                  className={`message-row ${isMe ? "me" : "them"}`}
                >
                  <div className="message-bubble">
                    <p>{msg.content}</p>
                    <span className="message-meta">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form className="chat-input-bar" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
