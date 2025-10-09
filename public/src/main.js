import { saveClicks } from "./utils.js";

console.log("✅ main.js loaded successfully!");

// Download app button
const downloadBtn = document.getElementById("downloadApp");
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    saveClicks("download");
    alert("📲 App download started!");
  });
}
