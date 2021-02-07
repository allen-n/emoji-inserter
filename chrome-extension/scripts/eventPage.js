// Event Listeners

// Run each time the active tab is changed to change the icon
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    // IconManager.tabUpdateIcon(tab);
  });
});


// Run the background script any time a new page is loaded and becomes the focus to run
// the feed and story bias calculations, and change the icon
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url) {
    // IconManager.tabUpdateIcon(tab)
  }
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.executeScript(tab.id, {
      file: "scripts/contentScript.js"
    }, function () {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        console.log('tab: ' + tab.id + ' lastError: ' + JSON.stringify(lastErr));
      }
      // IconManager.tabUpdateIcon(tab, true);
    });
  }
})
