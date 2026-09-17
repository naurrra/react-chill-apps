import { useState, useEffect, useCallback } from "react";
import {
  getWatchlist,
  addWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem,
} from "../api/watchlistApi.js";
 
function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const fetchWatchlist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWatchlist();
      setWatchlist(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);
 
  async function addItem(newItemData) {
    const response = await addWatchlistItem(newItemData);
    setWatchlist((prev) => [...prev, response.data]);
  }
 
  async function updateItem(id, updatedData) {
    const response = await updateWatchlistItem(id, updatedData);
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? response.data : item))
    );
  }
 
  async function deleteItem(id) {
    await deleteWatchlistItem(id);
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  }
 
  return {
    watchlist,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchWatchlist,
  };
}
 
export default useWatchlist;
