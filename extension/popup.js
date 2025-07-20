const queryInput = document.getElementById('query');
const searchBtn = document.getElementById('search');

function triggerSearch() {
  const query = queryInput.value.trim();
  if (!query) return;

  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  chrome.runtime.sendMessage({ action: 'semanticSearch', query }, (response) => {
    searchBtn.disabled = false;
    searchBtn.textContent = "Find Tab";

    if (!response?.success) {
      alert("Search failed: " + (response?.error || "Unknown error"));
    }
  });
}

searchBtn.addEventListener('click', triggerSearch);

queryInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();  // prevent form submission or other side effects
    triggerSearch();
  }
});
