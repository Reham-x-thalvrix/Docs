import { fetchEndpoints } from "./api.js";
import { setupSearch } from "./search.js";
import { initTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  
  const cardContainer = document.getElementById("cards-container");
  
  try {
    const data = await fetchEndpoints();
    if (data.status && data.apis) {
      renderCards(data.apis);
      setupSearch(data.apis, renderCards);
    }
  } catch (err) {
    if (cardContainer) cardContainer.innerHTML = "<p>Error loading endpoints.</p>";
  }
});

function renderCards(list) {
  const cardContainer = document.getElementById("cards-container");
  if (!cardContainer) return;

  cardContainer.innerHTML = list
    .map(
      (item) => `
    <div class="card">
      <div style="display:flex; justify-between; align-items:center;">
        <h3>${item.name}</h3>
        <span class="method-badge">${item.method.toUpperCase()}</span>
      </div>
      <p style="color:var(--text-muted); margin: 8px 0;">${item.description}</p>
      <code>/api${item.path}</code>
    </div>
  `
    )
    .join("");
}
