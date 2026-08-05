document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const searchBox = document.getElementById("search-container");
  const searchInput = document.getElementById("search-input");

  if (searchBtn && searchBox) {
    searchBtn.addEventListener("click", () => {
      const isVisible = searchBox.style.display === "block";
      searchBox.style.display = isVisible ? "none" : "block";
      if (!isVisible && searchInput) searchInput.focus();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (window.apiData && typeof window.renderAccordion === "function") {
        const filtered = window.apiData.filter(a => 
          a.name.toLowerCase().includes(query) || 
          (a.category && a.category.toLowerCase().includes(query)) ||
          a.path.toLowerCase().includes(query)
        );
        window.renderAccordion(filtered);
      }
    });
  }
});
