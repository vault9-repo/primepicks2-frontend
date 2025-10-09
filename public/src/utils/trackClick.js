// src/utils/trackClick.js
import axios from "axios";

export const API_BASE = "https://primepickstip.onrender.com"; // update if needed

const getUserId = () => {
  let userId = localStorage.getItem("pp_userId");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("pp_userId", userId);
  }
  return userId;
};

export const trackClick = async (type) => {
  try {
    const userId = getUserId();
    await axios.post(`${API_BASE}/api/clicks`, { type, userId });
  } catch (err) {
    console.error("Error tracking click:", err.message);
  }
};

// make globally available
window.trackClick = trackClick;
