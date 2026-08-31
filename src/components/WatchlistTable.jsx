// WatchlistTable.jsx
// Child component untuk READ + trigger UPDATE/DELETE.
// Tidak menyimpan data sendiri — items datang dari props (array yang sudah
// difilter/disortir oleh parent). onEdit/onDelete memberi tahu parent
// item mana yang harus diubah/dihapus dari array utama.

function statusClass(status) {
  if (status === "Selesai") return "selesai";
  if (status === "Sedang Ditonton") return "sedang";
  return "belum";
}

function WatchlistTable({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="watchlist-table-wrap">
        <div className="watchlist-empty">
          Belum ada tontonan yang cocok. Tambahkan lewat form di samping,
          atau ubah kata kunci pencarian.
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-table-wrap">
      <table className="watchlist-table">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Tipe</th>
            <th>Genre</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="wl-title">{item.title}</td>
              <td>{item.type}</td>
              <td>{item.genre}</td>
              <td>★ {item.rating}</td>
              <td>
                <span className={"status-pill " + statusClass(item.status)}>
                  {item.status}
                </span>
              </td>
              <td>
                <div className="row-actions">
                  <button type="button" onClick={() => onEdit(item)}>
                    Ubah
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => onDelete(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
