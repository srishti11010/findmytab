chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'semanticSearch') {
    (async () => {
      try {
        const tabs = await chrome.tabs.query({});
        const tabData = tabs.map(tab => tab.title?.slice(0, 150) || "");

        const response = await fetch("http://localhost:5000/search", {
          method: "POST",
          body: JSON.stringify({ query: message.query, tabs: tabData }),
          headers: { "Content-Type": "application/json" }
        });

        const { bestIndex } = await response.json();
        const bestTab = tabs[bestIndex];

        if (bestTab) {
          await chrome.tabs.update(bestTab.id, { active: true });
          await chrome.windows.update(bestTab.windowId, { focused: true });
        }

        sendResponse({ success: true });
      } catch (err) {
        console.error("Error in semanticSearch:", err);
        sendResponse({ success: false, error: err.message });
      }
    })();

    return true; // IMPORTANT: keeps message channel open for async response
  }
});
