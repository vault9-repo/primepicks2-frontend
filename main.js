// src/main.js
import axios from "axios";
import "./utils/trackClick.js"; // Optional shared logic

const API_BASE = "https://primepickstip.onrender.com";

// Assign or create user ID
let userId = localStorage.getItem("pp_userId");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("pp_userId", userId);
}

// --- Click tracking ---
async function trackClick(type) {
  try {
    await axios.post(`${API_BASE}/api/clicks`, { userId, type });
  } catch (err) {
    console.error("Error tracking click:", err.message);
  }
}

// Homepage & Download button clicks
document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("downloadAppBtn");
  const homepageBtn = document.getElementById("homepageBtn");

  homepageBtn?.addEventListener("click", () => trackClick("homepage"));
  downloadBtn?.addEventListener("click", () => trackClick("download"));
});

// Example live data fetch (predictions)
async function loadPredictions() {
  try {
    const res = await fetch(`${API_BASE}/predictions`);
    const data = await res.json();
    const container = document.getElementById("predictionsContainer");
    if (container) {
      container.innerHTML = "";
      data.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("prediction-item");
        div.textContent = `${item.homeTeam} vs ${item.awayTeam}`;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error("Failed to load predictions:", err);
  }
}

loadPredictions();
