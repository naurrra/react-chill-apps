// Register.jsx

function Register({ onNavigate, onRegisterSuccess }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setError("");
    onRegisterSuccess(username);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="assets/image/logo.png" alt="Chill" className="mark" />
        </div>

        <div className="auth-title">Daftar</div>
        <div className="auth-desc">Selamat datang!</div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="uname">Username</label>
            <input
              type="text"
              id="uname"
              name="uname"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Konfirmasi Kata Sandi</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Ulangi kata sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "6px" }}
          >
            Daftar
          </button>

          <div className="divider">
            <span>atau</span>
          </div>

          <button type="button" className="btn btn-sso">
            <svg
              className="icon-google"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20.4H24V27.6H35.4C33.7 32.3 29.2 35.6 24 35.6C17.4 35.6 12.4 30.6 12.4 24C12.4 17.4 17.4 12.4 24 12.4C27 12.4 29.7 13.5 31.8 15.3L37 10.1C33.7 7.1 29.1 5.2 24 5.2C13.7 5.2 5.2 13.7 5.2 24C5.2 34.3 13.7 42.8 24 42.8C34.3 42.8 42.8 34.6 42.8 24C42.8 22.8 42.7 21.6 43.6 20.5Z"
              />
              <path
                fill="#FF3D00"
                d="M7.5 14.7L13.9 19.4C15.6 15.4 19.5 12.4 24 12.4C27 12.4 29.7 13.5 31.8 15.3L37 10.1C33.7 7.1 29.1 5.2 24 5.2C17 5.2 10.9 9.1 7.5 14.7Z"
              />
              <path
                fill="#4CAF50"
                d="M24 42.8C29 42.8 33.5 41 36.8 38.1L31.1 33.3C29.2 34.7 26.8 35.6 24 35.6C18.9 35.6 14.5 32.3 12.7 27.7L6.3 32.6C9.6 38.2 16.3 42.8 24 42.8Z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20.4H24V27.6H35.4C34.6 29.9 33.1 31.9 31.1 33.3L36.8 38.1C36.4 38.4 43.8 32.9 43.8 24C43.8 22.8 43.7 21.6 43.6 20.5Z"
              />
            </svg>
            Daftar dengan Google
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun?{" "}
          <a
            href="#"
            className="link-small"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("login");
            }}
          >
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
