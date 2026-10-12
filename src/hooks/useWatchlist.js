import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../store/redux/reducer.js";
import {
  getWatchlist,
  addWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem,
} from "../api/watchlistApi.js";

function useWatchlist() {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.data.data);
    useEffect(() => {
      console.table(watchlist);
    }, [watchlist]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET -> simpan hasilnya ke Redux
  const loadData = useCallback(async () => {
    const response = await getWatchlist();
    dispatch(setData(response.data));
  }, [dispatch]);

  const fetchWatchlist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // ADD / EDIT / DELETE: panggil API, lalu GET ulang agar Redux sinkron.
  async function addItem(newItemData) {
    await addWatchlistItem(newItemData);
    await loadData();
  }

  async function updateItem(id, updatedData) {
    await updateWatchlistItem(id, updatedData);
    await loadData();
  }

  async function deleteItem(id) {
    await deleteWatchlistItem(id);
    await loadData();
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