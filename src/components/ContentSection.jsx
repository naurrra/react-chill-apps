// ContentSection.jsx

function ContentSection({ title, movies, variant, onOpenMovie }) {
  return (
    <section className="content-section">
      <div className="section-header">
        <h2>{title}</h2>
        <a href="#" className="see-all">
          Lihat semua
        </a>
      </div>
      <div className="card-row">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            variant={variant}
            onOpen={onOpenMovie}
          />
        ))}
      </div>
    </section>
  );
}
