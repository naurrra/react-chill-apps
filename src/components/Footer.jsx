// Footer.jsx

function Footer() {
  const genres = [
    "Aksi",
    "Anak-anak",
    "Anime",
    "Britania",
    "Drama",
    "Fantasi Ilmiah & Fantasi",
    "Kejahatan",
    "KDrama",
    "Komedi",
    "Petualangan",
    "Perang",
    "Romantis",
    "Sains & Alam",
    "Thriller",
  ];

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="assets/image/logo.png" alt="Chill" className="mark" />
        </div>

        <div className="footer-col">
          <h3>Genre</h3>
          <div className="footer-genre-grid">
            {genres.map((genre) => (
              <a href="#" key={genre}>
                {genre}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h3>Bantuan</h3>
          <a href="#">FAQ</a>
          <a href="#">Kontak Kami</a>
          <a href="#">Privasi</a>
          <a href="#">Syarat &amp; Ketentuan</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Chill.</p>
      </div>
    </footer>
  );
}
