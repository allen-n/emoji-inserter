import "../css/utils.css"
import "../css/popup.css";
import '../img/icon-128.png'

import hello from "./popup/example";
import utils, { msgCommands } from "./utils/utils"

var globals = {};
globals.maxResultTableLength = 15;
globals.resultTableIdx = 0;
globals.copyStr = "";
globals.interval = null;

/**
 *  Captures the globals.copyStr from the global scope, copies it to clipboard, and then closes the window
 * @param {Event} event an onchange or submit event handler
 */
function copyAndClosePopupHandler(event) {
    event.preventDefault()
    document.getElementById('overlay-id').className = "overlay on fade on";
    document.getElementById('copy-notification-id').className = "copy-notification on fade on"
    utils.copyTextToClipboard(globals.copyStr)
    setTimeout(window.close, 600);
    // window.close(); // close the popup, we're done
}

/**
 * 
 * @param {KeyboardEvent} event an incoming keyboard event that needs to be handled 
 */
function handleKeyDown(event) {
    const deltaTime = 200;
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            if (globals.interval == null) {
                globals.interval = setInterval(event => {
                    updateResultTable(globals.resultTableIdx - 1);
                }, deltaTime)
            }

            break;
        case 'ArrowDown':
            event.preventDefault();
            if (globals.interval == null) {
                globals.interval = setInterval(event => {
                    updateResultTable(globals.resultTableIdx + 1);
                }, deltaTime)
            }
            break;
        default:
            break;
    }
}

/**
 * 
 * @param {KeyboardEvent} event an incoming keyboard event that needs to be handled 
 */
function handleKeyUp(event) {
    if (globals.interval != null) {
        clearInterval(globals.interval)
        globals.interval = null;
    }
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
        idx = Math.max(Math.min(numRows - 1, idx), 0);
        globals.resultTableIdx = idx;
        for (var i = 0; i < numRows; ++i) {
            table.rows[i].cells[numCols - 1].style.background = 'var(--grey)';
        }
        let cell = table.rows[idx].cells[numCols - 1]
        cell.style.background = 'var(--light-blue)';
        globals.copyStr = cell.innerText
        if (idx == 0) {
            updateHintText('Use up / down arrows to navigate')
        } else {
            updateHintText('Press enter to copy emoji!')
        }
    } else {
        globals.copyStr = ""
        updateHintText('')
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

function updateHintText(text) {
    let hint = document.getElementById('hint-text');
    hint.innerText = text
}

// Event Listeners
const emojiMatchPort = chrome.extension.connect({
    name: 'emojiMatchPort'
})

emojiMatchPort.onMessage.addListener(populateResultsTable)
document.getElementById('search-form').addEventListener('submit', copyAndClosePopupHandler)
document.getElementById('search-form').addEventListener('keyup', handleKeyUp);
document.getElementById('search-form').addEventListener('keydown', handleKeyDown);
