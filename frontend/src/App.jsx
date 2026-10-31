import React, { useEffect, useState } from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Empty from "./components/Empty.jsx";
import Protected from "./components/Protected.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Details from "./pages/Details.jsx";
import Favorites from "./pages/Favorites.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BoardingForm from "./pages/BoardingForm.jsx";
import About from "./pages/About.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import StudentRequests from "./pages/StudentRequests.jsx";
import api, { clearAuthSession } from "./services/api.js";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("boardease_user"));
    } catch {
      return null;
    }
  });
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("boardease_theme") === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("boardease_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    if (user.role === "student") {
      api("/favorites")
        .then(setFavorites)
        .catch(() => {});
    }
  }, [user]);

  function onUserChange(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem("boardease_user", JSON.stringify(updatedUser));
  }

  function toggleFavorite(id) {
    if (!user) {
      alert("Please log in first to save your favourite spaces.");
      return;
    }
    if (user.role !== "student") {
      alert("Only student accounts can save listings.");
      return;
    }
    api(`/favorites/${id}`, { method: "POST" })
      .then(setFavorites)
      .catch((e) => alert(e.message));
  }

  function onAuth(data) {
    localStorage.setItem("boardease_token", data.token);
    localStorage.setItem("boardease_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    clearAuthSession();
    setUser(null);
    setFavorites([]);
  }

  const props = { favorites, toggleFavorite, user };

  return (
    <ErrorBoundary>
      <div className="app">
        <Nav user={user} logout={logout} theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<Home {...props} />} />
          <Route path="/explore" element={<Explore {...props} />} />
          <Route
            path="/boarding/:id"
            element={
              <Protected user={user}>
                <Details {...props} />
              </Protected>
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/favorites"
            element={
              <Protected user={user} role="student">
                <Favorites {...props} />
              </Protected>
            }
          />
          <Route
            path="/requests"
            element={
              <Protected user={user} role="student">
                <StudentRequests />
              </Protected>
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={user.role === "owner" ? "/dashboard" : "/explore"}
                />
              ) : (
                <Auth onAuth={onAuth} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate
                  to={user.role === "owner" ? "/dashboard" : "/explore"}
                />
              ) : (
                <Auth mode="register" onAuth={onAuth} />
              )
            }
          />
          <Route
            path="/settings"
            element={
              <Protected user={user}>
                <SettingsPage
                  user={user}
                  onUserChange={onUserChange}
                  theme={theme}
                  setTheme={setTheme}
                  logout={logout}
                />
              </Protected>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Protected user={user} role="owner">
                <Dashboard user={user || { name: "Owner" }} />
              </Protected>
            }
          />
          <Route
            path="/dashboard/new"
            element={
              <Protected user={user} role="owner">
                <BoardingForm />
              </Protected>
            }
          />
          <Route
            path="/dashboard/edit/:id"
            element={
              <Protected user={user} role="owner">
                <BoardingForm />
              </Protected>
            }
          />
          <Route
            path="*"
            element={
              <div className="page-width">
                <Empty
                  title="Page not found"
                  text="Looks like this space doesn't exist."
                >
                  <Link className="btn btn-dark" to="/">
                    Back to home
                  </Link>
                </Empty>
              </div>
            }
          />
        </Routes>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
