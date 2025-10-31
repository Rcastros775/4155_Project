import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import logo from "./assets/All-in-C.png";

import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Events from "./pages/Events";
import Friends from "./pages/Friends";
import Bookmarks from "./pages/Bookmarks";
import Login from "./pages/Login";
import Register from "./pages/Register"; // ✅ added
import EventDetail from "./pages/EventDetail";
import Profile from "./pages/Profile";

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    window.location.reload();
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
          <Link to="/friends">Friends</Link>
          <Link to="/bookmarks">Bookmarks</Link>
        </div>

        <div className="profile">
          {username ? (
            <>
              <span className="profile-icon"></span>
              <Link to="/profile" style={{ marginLeft: "10px", fontWeight: "600", cursor: "pointer", textDecoration: "none" }}>
                Hi, {username}
              </Link>
              <button className="login-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="login-btn">Log in</button>
            </Link>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ✅ new */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
