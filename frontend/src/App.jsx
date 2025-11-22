import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import logo from "./assets/All-in-C.png";
import { useNavigate } from "react-router-dom";

import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import EventDetail from "./pages/Events/EventDetail";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import Stats from "./pages/Stats/Stats";
import Chat from "./pages/Messages/Chat";
import MessagesList from "./pages/Messages/MessagesList";
import Profile from "./pages/Profile/Profile";

function App() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateName = () => {
      setUsername(localStorage.getItem("username"));
    };
    updateName();
    window.addEventListener("storage", updateName);
    return () => window.removeEventListener("storage", updateName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/");
  };

  return (
    <>
      <header>
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
        </Link>

        <div className="nav-buttons">
          <Link to="/stats">Stats</Link>
          <Link to="/events">Events</Link>
          {username && <Link to="/friends">Friends</Link>}
          {username && <Link to="/bookmarks">Bookmarks</Link>}
        </div>

        <div className="profile">
          {username ? (
            <>
              <Link to="/messages" className="messages-btn">
                💬
              </Link>
              <Link to="/profile" className="profile-icon profile-link">
                Hi, {username}
              </Link>
              <button className="login-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login">
              {" "}
              <button className="login-btn">Log in</button>
            </Link>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/login" element={<Login setUsername={setUsername} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/messages" element={<MessagesList />} />
          <Route path="/messages/:userId" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
