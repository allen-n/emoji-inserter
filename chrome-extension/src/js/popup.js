import "../css/utils.css"
import "../css/popup.css";
import '../img/icon-128.png'

import hello from "./popup/example";
import utils, { msgCommands } from "./utils/utils"

var globals = {};
globals.maxResultTableLength = 15;
globals.resultTableIdx = 0;
globals.copyStr = "";

/**
 *  Captures the globals.copyStr from the global scope, copies it to clipboard, and then closes the window
 * @param {Event} event an onchange or submit event handler
 */
function copyAndClosePopupHandler(event) {
    event.preventDefault()
    utils.copyTextToClipboard(globals.copyStr)
    window.close(); // close the popup, we're done
}

/**
 * 
 * @param {KeyboardEvent} event an incoming keyboard event that needs to be handled 
 */
function handleKeypress(event) {
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            updateResultTable(globals.resultTableIdx - 1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            updateResultTable(globals.resultTableIdx + 1);
            break;

        default:
            emojiMatchPort.postMessage({
                "command": msgCommands.emojiMatchString,
                "data": event.target.value
            });
            break;
    }
}

function updateResultTable(idx) {
    let table = document.getElementById('found-emojis');
    let numRows = table.rows.length
    if (numRows > 0) {
        let numCols = table.rows[0].cells.length
        idx = Math.max(Math.min(numRows, idx), 0);
        globals.resultTableIdx = idx;
        for (var i = 0; i < numRows; ++i) {
            // table.rows[i].style.backgroundColor = 'blue';
            table.rows[i].cells[numCols - 1].style.background = 'rgba(196, 196, 196, 0.24)';
        }
        let cell = table.rows[idx].cells[numCols - 1]
        cell.style.background = 'rgba(75, 140, 248, 0.69)';
        globals.copyStr = cell.innerText
    } else {
        globals.copyStr = ""
    }
}

function populateResultsTable(results) {
    globals.resultTableIdx = -1;
    var currentResultIdx = 0;
    var table = document.getElementById('found-emojis');
    table.innerHTML = "";
    for (const result in results) {
        currentResultIdx++;
        if (currentResultIdx > globals.maxResultTableLength) {
            break;
        }
        if (Object.hasOwnProperty.call(results, result)) {
            const element = results[result].item;
            // console.log(`${element.name}: ${element.emoji}`)
            // let div = document.createElement('div')
            
            let row = document.createElement('tr')
            row.setAttribute('class', 'emoji-row')
            let col1 = document.createElement('td');
            col1.textContent = element.name;

            let col2 = document.createElement('td');
            col2.innerText = element.emoji

            col1.setAttribute('class', 'emoji-text')
            col2.setAttribute('class', 'emoji-img')

            row.appendChild(col1)
            row.appendChild(col2)
            // div.appendChild(row)
            table.appendChild(row)
        }
    }
    updateResultTable(globals.resultTableIdx);
}

// Event Listeners
const emojiMatchPort = chrome.extension.connect({
    name: 'emojiMatchPort'
})

emojiMatchPort.onMessage.addListener(populateResultsTable)
document.getElementById('search-form').addEventListener('submit', copyAndClosePopupHandler)
document.getElementById('search-form').addEventListener('keyup', handleKeypress);
