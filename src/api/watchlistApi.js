import axiosInstance from "./axiosInstance.js";
 
export function getWatchlist() {
  return axiosInstance.get("/");
}
 
export function addWatchlistItem(data) {
  return axiosInstance.post("/", data);
}
 
export function updateWatchlistItem(id, data) {
  return axiosInstance.put(`/${id}`, data);
}
 
export function deleteWatchlistItem(id) {
  return axiosInstance.delete(`/${id}`);
}
