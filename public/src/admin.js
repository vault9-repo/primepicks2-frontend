// src/admin.js
import axios from "axios";

const API_BASE = "https://primepickstip.onrender.com";

// --- Get or create user ID ---
let userId = localStorage.getItem("pp_userId");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("pp_userId", userId);
}

// --- Track clicks (same as user site) ---
async function trackClick(type) {
  try {
    await axios.post(`${API_BASE}/api/clicks`, { userId, type });
  } catch (err) {
    console.error("Error tracking click:", err.message);
  }
}

// --- Tabs logic ---
const tabUpcoming = document.getElementById("tab-upcoming");
const tabPredictions = document.getElementById("tab-predictions");
const tabClicks = document.getElementById("tab-clicks");
const upcomingSection = document.getElementById("upcomingSection");
const predictionSection = document.getElementById("predictionSection");
const clickSection = document.getElementById("clickSection");

function activateTab(tab) {
  [tabUpcoming, tabPredictions, tabClicks].forEach(t => t.classList.remove("active"));
  [upcomingSection, predictionSection, clickSection].forEach(s => s.style.display = "none");

  if (tab === "upcoming") {
    tabUpcoming.classList.add("active");
    upcomingSection.style.display = "block";
    loadMatches();
  } else if (tab === "predictions") {
    tabPredictions.classList.add("active");
    predictionSection.style.display = "block";
    loadPredictions();
  } else if (tab === "clicks") {
    tabClicks.classList.add("active");
    clickSection.style.display = "block";
    loadClicks();
  }
}

tabUpcoming?.addEventListener("click", () => activateTab("upcoming"));
tabPredictions?.addEventListener("click", () => activateTab("predictions"));
tabClicks?.addEventListener("click", () => activateTab("clicks"));

// --- Load Matches ---
const matchesContainer = document.getElementById("matchesContainer");
const addMatchForm = document.getElementById("addMatchForm");

async function loadMatches() {
  const res = await fetch(`${API_BASE}/admin/fixtures`);
  const data = await res.json();
  matchesContainer.innerHTML = "";

  data.forEach(f => {
    const div = document.createElement("div");
    div.classList.add("match-card");
    div.innerHTML = `
      <span>${f.date} ${f.time} - ${f.homeTeam} vs ${f.awayTeam} (League: ${f.leagueId || "-"})</span>
      <span>
        <button class="btn btn-warning btn-sm edit" data-id="${f._id}">Edit</button>
        <button class="btn btn-danger btn-sm delete" data-id="${f._id}">Delete</button>
      </span>
    `;
    matchesContainer.appendChild(div);
  });

  document.querySelectorAll(".delete").forEach(btn =>
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await fetch(`${API_BASE}/admin/fixture`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      loadMatches();
    })
  );

  document.querySelectorAll(".edit").forEach(btn =>
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const homeTeam = prompt("Edit Home Team");
      const awayTeam = prompt("Edit Away Team");
      const date = prompt("Edit Date YYYY-MM-DD");
      const time = prompt("Edit Time HH:MM");
      const leagueId = prompt("Edit League ID");
      if (homeTeam && awayTeam && date && time) {
        await fetch(`${API_BASE}/admin/fixture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id, homeTeam, awayTeam, date, time, leagueId }),
        });
        loadMatches();
      }
    })
  );
}

addMatchForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const date = document.getElementById("matchDate").value;
  const time = document.getElementById("matchTime").value;
  const homeTeam = document.getElementById("homeTeam").value;
  const awayTeam = document.getElementById("awayTeam").value;
  const leagueId = document.getElementById("leagueId").value;
  await fetch(`${API_BASE}/admin/fixture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, time, homeTeam, awayTeam, leagueId }),
  });
  addMatchForm.reset();
  loadMatches();
});

// --- Predictions ---
const predictionsContainer = document.getElementById("predictionsContainer");
const addPredictionForm = document.getElementById("addPredictionForm");

async function loadPredictions() {
  const res = await fetch(`${API_BASE}/admin/predictions`);
  const data = await res.json();
  predictionsContainer.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("prediction-card");
    div.innerHTML = `
      <span>${p.homeTeam} vs ${p.awayTeam}</span>
      <span>
        <button class="btn btn-warning btn-sm editPred" data-id="${p._id}">Edit</button>
        <button class="btn btn-danger btn-sm deletePred" data-id="${p._id}">Delete</button>
      </span>
    `;
    predictionsContainer.appendChild(div);
  });

  document.querySelectorAll(".deletePred").forEach(btn =>
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await fetch(`${API_BASE}/admin/prediction`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      loadPredictions();
    })
  );

  document.querySelectorAll(".editPred").forEach(btn =>
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const homeTeam = prompt("Edit Home Team");
      const awayTeam = prompt("Edit Away Team");
      if (homeTeam && awayTeam) {
        await fetch(`${API_BASE}/admin/prediction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id, homeTeam, awayTeam }),
        });
        loadPredictions();
      }
    })
  );
}

addPredictionForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const homeTeam = document.getElementById("predHome").value;
  const awayTeam = document.getElementById("predAway").value;
  await fetch(`${API_BASE}/admin/prediction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ homeTeam, awayTeam }),
  });
  addPredictionForm.reset();
  loadPredictions();
});

// --- Clicks ---
const homepageClicks = document.getElementById("homepageClicks");
const downloadClicks = document.getElementById("downloadClicks");
const refreshClicks = document.getElementById("refreshClicks");

async function loadClicks() {
  try {
    const homeRes = await fetch(`${API_BASE}/api/clicks?type=homepage`);
    const homeData = await homeRes.json();
    homepageClicks.innerText = homeData.count;

    const downloadRes = await fetch(`${API_BASE}/api/clicks?type=download`);
    const downloadData = await downloadRes.json();
    downloadClicks.innerText = downloadData.count;
  } catch (err) {
    homepageClicks.innerText = "Error";
    downloadClicks.innerText = "Error";
  }
}

refreshClicks?.addEventListener("click", loadClicks);

// Track homepage load
window.addEventListener("load", () => trackClick("admin_homepage"));
loadMatches();
loadPredictions();
loadClicks();
