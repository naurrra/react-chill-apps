// MovieCard.jsx
// Satu komponen dipakai ulang untuk 4 seksi berbeda di index.html
// (Lanjutkan Menonton, Top Rating, Trending, Rilis Baru).
// Semua data datang dari props — komponen ini tidak punya state sendiri.

function MovieCard({ movie, variant, onOpen }) {
  const isTall = variant !== "continue";

  return (
    <div
      className={
        "movie-card" + (variant === "rank" ? " movie-card-rank" : "")
      }
      onClick={() => onOpen && onOpen(movie)}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      {variant === "rank" && <span className="rank-number">Top 10</span>}
      {variant === "new" && <span className="badge-new">Baru</span>}
      {variant === "episode" && <span className="badge-ep">Episode Baru</span>}

      <div className={"poster" + (isTall ? " poster-tall" : "")}>
        <img src={movie.image} alt={movie.title} />
      </div>

      {variant === "rating" && (
        <span className="rating-badge">★ {movie.rating}</span>
      )}

      {(variant === "continue" || variant === "rating") && (
        <div className="info">
          <div className="title">{movie.title}</div>
          {variant === "continue" && (
            <React.Fragment>
              <div className="meta">{movie.meta}</div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: movie.progress + "%" }}
                ></div>
              </div>
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}
