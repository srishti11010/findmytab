document.getElementById('search').addEventListener('click', async () => {
  const query = document.getElementById('query').value.trim();
  if (!query) return;

  chrome.runtime.sendMessage({ action: 'semanticSearch', query });
});
