chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'semanticSearch') {
    const tabs = await chrome.tabs.query({});

    const tabData = tabs.map(tab => `${tab.title} ${tab.url}`);

    const response = await fetch("http://localhost:5000/search", {
      method: "POST",
      body: JSON.stringify({ query: message.query, tabs: tabData }),
      headers: { "Content-Type": "application/json" }
    });

    const { bestIndex } = await response.json();
    const bestTab = tabs[bestIndex];

    if (bestTab) {
      chrome.tabs.update(bestTab.id, { active: true });
      chrome.windows.update(bestTab.windowId, { focused: true });
    }
  }
});
