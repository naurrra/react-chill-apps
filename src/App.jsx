// App.jsx 

function App() {
  const [page, setPage] = React.useState("login");
  const [user, setUser] = React.useState(null);
  const [watchlist, setWatchlist] = React.useState(initialWatchlist);

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

  function handleLogout() {
    setUser(null);
    setPage("login");
  }

  function handleWatchNow(title) {
    alert("Memutar: " + title);
  }

  // ---- CRUD handlers untuk array watchlist ----

  function handleAddItem(newItemData) {
    setWatchlist((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((i) => i.id)) + 1 : 1;
      return [...prev, { id: nextId, ...newItemData }];
    });
  }

  function handleUpdateItem(id, updatedData) {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }

  function handleDeleteItem(id) {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  }

  const sections = [
    {
      key: "continue",
      title: "Lanjutkan Menonton",
      movies: continueWatching,
      variant: "continue",
    },
    {
      key: "rating",
      title: "Top Rating",
      movies: topRating,
      variant: "rating",
    },
    {
      key: "trending",
      title: "Sedang Trending",
      movies: trending,
      variant: "rank",
    },
    {
      key: "new",
      title: "Rilis Film Baru",
      movies: newReleases,
      variant: "new",
    },
  ];

  return (
    <React.Fragment>
      {page !== "login" && page !== "register" && (
        <Header
          currentPage={page}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {page === "home" && (
        <Home
          heroMovie={heroMovie}
          sections={sections}
          onWatch={handleWatchNow}
        />
      )}

      {page === "login" && (
        <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
      )}

      {page === "register" && (
        <Register
          onNavigate={handleNavigate}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {page === "watchlist" && (
        <Watchlist
          watchlist={watchlist}
          onAdd={handleAddItem}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
      )}

      {page !== "login" && page !== "register" && <Footer />}
    </React.Fragment>
  );
}