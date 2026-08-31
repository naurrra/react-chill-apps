// Watchlist.jsx

function Watchlist({ watchlist, onAdd, onUpdate, onDelete }) {
  const [editingItem, setEditingItem] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [duplicateNotice, setDuplicateNotice] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("Semua");

  function handleSave(formData) {
    if (editingItem) {
      onUpdate(editingItem.id, formData);
      setEditingItem(null);
      setShowModal(false);
      return;
    }

    // Cegah judul duplikat saat menambah item baru (case-insensitive).
    const isDuplicate = watchlist.some(
      (item) => item.title.trim().toLowerCase() === formData.title.trim().toLowerCase()
    );

    if (isDuplicate) {
      setShowModal(false);
      setDuplicateNotice(true);
      return;
    }

    onAdd(formData);
    setShowModal(false);
  }

  function handleOpenAdd() {
    setEditingItem(null);
    setShowModal(true);
  }

  function handleEdit(item) {
    setEditingItem(item);
    setShowModal(true);
  }

  function handleCloseModal() {
    setEditingItem(null);
    setShowModal(false);
  }

  function handleCloseDuplicateNotice() {
    setDuplicateNotice(false);
  }

  function handleDelete(id) {
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
      setShowModal(false);
    }
    onDelete(id);
  }

  // Derivasi tampilan: filter + search dihitung ulang tiap render,
  // bukan disimpan sebagai state terpisah (menghindari data ganda).
  const filteredItems = watchlist.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "Semua" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1>Watchlist</h1>
      </div>

      <div className="watchlist-actions-row">
        <button
          type="button"
          className="btn btn-primary btn-add-watchlist"
          onClick={handleOpenAdd}
        >
          + Tambah
        </button>
      </div>

      <div className="watchlist-toolbar">
        <input
          type="text"
          placeholder="Cari judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Semua">Semua Status</option>
          <option value="Belum Ditonton">Belum Ditonton</option>
          <option value="Sedang Ditonton">Sedang Ditonton</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      <WatchlistTable
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <WatchlistForm
          editingItem={editingItem}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      )}

      {duplicateNotice && (
        <div className="modal-overlay" onClick={handleCloseDuplicateNotice}>
          <div className="notice-card" onClick={(e) => e.stopPropagation()}>
            <p>Film ini sudah kamu tambah ke list.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCloseDuplicateNotice}
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
}