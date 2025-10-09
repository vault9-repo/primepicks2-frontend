import axios from "axios";
import { API_BASE } from "./trackClick.js";

export const trackAdminAction = async (action) => {
  try {
    const adminId = localStorage.getItem("pp_admin") || "unknown_admin";
    await axios.post(`${API_BASE}/api/admin/actions`, { action, adminId });
  } catch (err) {
    console.error("Error tracking admin action:", err.message);
  }
};
