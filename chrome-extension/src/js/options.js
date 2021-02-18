import "../css/utils.css"
import "../css/options.css";

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('settings-link').addEventListener('click', function() {
        chrome.tabs.update({ url: 'chrome://extensions/shortcuts' });
    });
});