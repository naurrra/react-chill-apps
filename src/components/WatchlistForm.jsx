// WatchlistForm.jsx
// Child component untuk CREATE dan UPDATE.
// - editingItem (dari parent): kalau ada isinya => mode edit, form ke-prefill.
// - onSave / onCancel: callback ke parent, parent yang ubah array watchlist.
// Form fields sendiri state lokal (typing di sini tidak perlu re-render parent).
//
// Halaman ini dipakai oleh USER BIASA (bukan admin), jadi Tipe dan Genre
// tidak bisa diisi/diubah dari sini — itu data master film yang sudah
// ditentukan. User hanya mengatur Judul, Rating pribadi, dan Status Tonton.
// Item baru otomatis dapat Tipe "Film" dan Genre "Umum" sebagai default.

const emptyForm = {
  title: "",
  rating: "",
  status: "Belum Ditonton",
};

const DEFAULT_TYPE = "Film";
const DEFAULT_GENRE = "Umum";

function WatchlistForm({ editingItem, onSave, onCancel }) {
  const [form, setForm] = React.useState(emptyForm);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title,
        rating: String(editingItem.rating),
        status: editingItem.status,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editingItem]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }

    const ratingNum = Number(form.rating);
    if (form.rating !== "" && (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10)) {
      setError("Rating harus berupa angka antara 0 - 10.");
      return;
    }

    setError("");
    onSave({
      title: form.title.trim(),
      type: editingItem ? editingItem.type : DEFAULT_TYPE,
      genre: editingItem ? editingItem.genre : DEFAULT_GENRE,
      rating: form.rating === "" ? 0 : ratingNum,
      status: form.status,
    });

    if (!editingItem) {
      setForm(emptyForm);
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="watchlist-form-card" onClick={(e) => e.stopPropagation()}>
        <h2>{editingItem ? "Ubah Tontonan" : "Tambah ke Daftar Saya"}</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="wl-title">Judul</label>
            <input
              type="text"
              id="wl-title"
              placeholder="Contoh: Suzume"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="wl-rating">Rating (0 - 10)</label>
            <input
              type="number"
              id="wl-rating"
              min="0"
              max="10"
              step="0.1"
              placeholder="Contoh: 8.5"
              value={form.rating}
              onChange={(e) => handleChange("rating", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="wl-status">Status Tonton</label>
            <select
              id="wl-status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="Belum Ditonton">Belum Ditonton</option>
              <option value="Sedang Ditonton">Sedang Ditonton</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}