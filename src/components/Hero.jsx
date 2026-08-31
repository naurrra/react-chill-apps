// Hero.jsx
// Volume control HANYA dipakai di dalam Hero, jadi state-nya lokal di sini
// (tidak perlu naik ke App). Ini contoh "deteksi komponen mana yang berubah":
// ubah volume => hanya Hero yang re-render, bukan Header/ContentSection lain.

function Hero({ movie, onWatch }) {
  const [volume, setVolume] = React.useState(70);
  const [lastVolume, setLastVolume] = React.useState(70);
  const [isMuted, setIsMuted] = React.useState(false);

  function volumeIcon(value) {
    if (value == 0) return "🔇";
    if (value < 50) return "🔉";
    return "🔊";
  }

  function handleVolumeChange(e) {
    const value = Number(e.target.value);
    setVolume(value);
    setIsMuted(value == 0);
  }

  function toggleMute() {
    if (isMuted) {
      setVolume(lastVolume);
      setIsMuted(false);
    } else {
      setLastVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-slide active">
        <img src={movie.image} alt={movie.title} />
      </div>

      <div className="hero-content">
        <span className="hero-eyebrow">Film Pilihan</span>
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-desc">{movie.description}</p>

        <div className="hero-actions">
          <button
            className="btn-hero-primary"
            onClick={() => onWatch(movie.title)}
          >
            ▶ Mulai Nonton
          </button>
          <button className="btn-hero-secondary">ⓘ Selengkapnya</button>
          <div className="volume-control align-right">
            <button onClick={toggleMute}>{volumeIcon(volume)}</button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
