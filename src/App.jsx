// App.jsx — parent tertinggi aplikasi.

import { Fragment, useState } from "react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import useWatchlist from "./hooks/useWatchlist.js";

import initialWatchlist from "./data/watchlistData.js";
import {
  heroMovie,
  continueWatching,
  topRating,
  trending,
  newReleases,
} from "./data/movieData.js";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const { watchlist, isLoading, error, addItem, updateItem, deleteItem, refetch } = useWatchlist();

  function handleNavigate(nextPage) {
    setPage(nextPage);
  }

  function handleLoginSuccess(username) {
    setUser(username);
    setPage("home");
  }

  function handleRegisterSuccess(username) {
    setUser(username);
    setPage("home");
  }

  function handleWatchNow(title) {
    alert("Memutar: " + title);
  }


  const sections = [
    { key: "continue", title: "Lanjutkan Menonton", movies: continueWatching, variant: "continue" },
    { key: "rating", title: "Top Rating", movies: topRating, variant: "rating" },
    { key: "trending", title: "Sedang Trending", movies: trending, variant: "rank" },
    { key: "new", title: "Rilis Film Baru", movies: newReleases, variant: "new" },
  ];

  return (
    <Fragment>
      {page !== "login" && page !== "register" && (
        <Header currentPage={page} onNavigate={handleNavigate} />
      )}

      {page === "home" && (
        <Home heroMovie={heroMovie} sections={sections} onWatch={handleWatchNow} />
      )}

      {page === "login" && (
        <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
      )}

      {page === "register" && (
        <Register onNavigate={handleNavigate} onRegisterSuccess={handleRegisterSuccess} />
      )}

      {page === "watchlist" && (
      <Watchlist
        watchlist={watchlist}
        isLoading={isLoading}
        error={error}
        onAdd={addItem}
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
    )}

      {page !== "login" && page !== "register" && <Footer />}
    </Fragment>
  );
}

export default App;