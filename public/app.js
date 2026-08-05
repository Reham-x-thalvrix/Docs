window.apiData = [];
let currentApi = null;

document.addEventListener("DOMContentLoaded", async () => {
  const accordionContainer = document.getElementById("category-accordion");

  try {
    const res = await fetch("/api/list");
    const data = await res.json();

    if (data.status && data.apis) {
      window.apiData = data.apis;
      updateStats(window.apiData);
      renderAccordion(window.apiData);
    }
  } catch (err) {
    if (accordionContainer) {
      accordionContainer.innerHTML = `<p style="text-align:center; color: var(--nitro-red);">Failed to connect to API engine!</p>`;
    }
  }

  setupEvents();
});

function updateStats(apis) {
  const total = apis.length;
  const getCount = apis.filter(a => (a.method || "GET").toUpperCase() === "GET").length;
  const postCount = apis.filter(a => (a.method || "").toUpperCase() === "POST").length;
  const categories = [...new Set(apis.map(a => a.category || "General"))].length;

  document.getElementById("stat-total").innerText = total;
  document.getElementById("stat-get").innerText = getCount;
  document.getElementById("stat-post").innerText = postCount;
  document.getElementById("stat-cats").innerText = categories;

  document.getElementById("footer-text").innerText = `${total} APIs in ${categories} categories`;
}

window.renderAccordion = function(apis) {
  const container = document.getElementById("category-accordion");
  if (!container) return;

  if (apis.length === 0) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 20px;">No APIs found!</p>`;
    return;
  }

  const grouped = {};
  apis.forEach(api => {
    const cat = api.category || "General";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(api);
  });

  container.innerHTML = Object.keys(grouped)
    .map(cat => {
      const items = grouped[cat];
      return `
        <div class="cat-item">
          <div class="cat-header" onclick="toggleCat(this)">
            <div class="cat-title">
              <span>${cat}</span>
              <span class="cat-badge">${items.length}</span>
            </div>
            <i class="fa-solid fa-chevron-right cat-arrow"></i>
          </div>
          <div class="cat-body">
            ${items.map(item => `
              <div class="api-row">
                <div class="api-row-left">
                  <i class="fa-solid fa-ellipsis-vertical three-dot-btn" onclick="openModal('${item.path}')"></i>
                  <span class="api-name">${item.name}</span>
                </div>
                <span class="method-tag ${(item.method || "GET").toLowerCase()}">${(item.method || "GET").toUpperCase()}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
};

function setupEvents() {
  document.querySelectorAll(".stat-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".stat-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const filter = card.dataset.filter;
      if (filter === "get") {
        window.renderAccordion(window.apiData.filter(a => (a.method || "GET").toUpperCase() === "GET"));
      } else if (filter === "post") {
        window.renderAccordion(window.apiData.filter(a => (a.method || "").toUpperCase() === "POST"));
      } else {
        window.renderAccordion(window.apiData);
      }
    });
  });

  document.getElementById("modal-close-btn").addEventListener("click", closeModal);
  document.getElementById("btn-cancel").addEventListener("click", closeModal);
  document.getElementById("btn-submit").addEventListener("click", executeApi);
}

window.openModal = (path) => {
  currentApi = window.apiData.find(a => a.path === path);
  if (!currentApi) return;

  document.getElementById("modal-title").innerText = currentApi.name;
  document.getElementById("modal-desc").innerText = currentApi.description || "Enter parameter details below:";

  const paramsContainer = document.getElementById("modal-params-container");
  paramsContainer.innerHTML = "";

  const params = currentApi.params || ["prompt"];
  params.forEach(p => {
    paramsContainer.innerHTML += `
      <div class="param-group">
        <label>${p.toUpperCase()}</label>
        <input type="text" id="param-${p}" placeholder="Enter ${p}...">
      </div>
    `;
  });

  document.getElementById("response-box").style.display = "none";
  document.getElementById("api-modal").style.display = "flex";
};

function closeModal() {
  document.getElementById("api-modal").style.display = "none";
}

async function executeApi() {
  if (!currentApi) return;

  const params = currentApi.params || ["prompt"];
  const queryParams = new URLSearchParams();

  params.forEach(p => {
    const input = document.getElementById(`param-${p}`);
    if (input) queryParams.append(p, input.value);
  });

  const resBox = document.getElementById("response-box");
  const resData = document.getElementById("response-data");
  resBox.style.display = "block";
  resData.innerText = "Processing request...";

  try {
    const res = await fetch(`/api${currentApi.path}?${queryParams.toString()}`);
    const data = await res.json();
    resData.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    resData.innerText = "Error executing request!";
  }
}
