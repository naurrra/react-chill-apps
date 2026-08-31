// Header.jsx

function Header({ currentPage, onNavigate, user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const navItems = [
    { key: "home", label: "Home" },
    { key: "series", label: "Series", disabled: true },
    { key: "film", label: "Film", disabled: true },
    { key: "watchlist", label: "Watchlist" },
  ];

  function handleLogoutClick() {
    setDropdownOpen(false);
    onLogout();
  }

  return (
    <header className="site-header">
      <div className="header-left">
        <div className="brand">
          <img src="assets/image/logo.png" className="mark" alt="Moviez" />
        </div>
        <nav className="main-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={
                "navlink-btn" + (currentPage === item.key ? " active" : "")
              }
              onClick={() => !item.disabled && onNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="header-right">
  <div className="avatar-menu">
    <button
      type="button"
      className="avatar-btn"
      onClick={() => setDropdownOpen((prev) => !prev)}
      aria-label="Buka menu akun"
    >
      <img
        src="assets/image/user-icon.png"
        alt="Profil pengguna"
        className="avatar"
      />
      <span className="avatar-username">{user}</span>
    </button>

    {dropdownOpen && (
      <div className="avatar-dropdown">
        <button type="button" className="avatar-dropdown-item">
          Profil
        </button>
        <button
          type="button"
          className="avatar-dropdown-item avatar-dropdown-logout"
          onClick={handleLogoutClick}
        >
          Keluar
        </button>
      </div>
    )}
  </div>
</div>
    </header>
  );
}