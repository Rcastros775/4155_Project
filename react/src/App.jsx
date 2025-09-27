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

function App() {
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
          <span className="profile-icon"></span>
          <Link to="/login">
            <button className="login-btn">Log in</button>
          </Link>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/events" element={<Events />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
