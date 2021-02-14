import { isNumeric } from "jquery";
import "../css/popup.css";
import hello from "./popup/example";
import fetchEmojiListPort from "./utils/utils"

// import Fuse from 'fuse.js'
// const $ = require("jquery");

function copyTextToClipboard(text) {
    if (text) {
        //Create a textbox field where we can insert text to. 
        var copyFrom = document.createElement('textarea');
        // text = 'a test string!'

        //Set the text content to be the text you wished to copy.
        copyFrom.textContent = text;

        //Append the textbox field into the body as a child. 
        //'execCommand()' only works when there exists selected text, and the text is inside 
        //document.body (meaning the text is part of a valid rendered HTML element).
        document.body.appendChild(copyFrom);

        //Select all the text!
        copyFrom.select();

        //Execute command
        document.execCommand('copy');

        //(Optional) De-select the text using blur(). 
        copyFrom.blur();

        //Remove the textbox field from the document.body, so no other JavaScript nor 
        //other elements can get access to this.
        document.body.removeChild(copyFrom);
    }
}
// const fuseOptions = {
//     isCaseSensitive: false,
//     // includeScore: false,
//     // shouldSort: true,
//     includeMatches: false,
//     findAllMatches: true,
//     // minMatchCharLength: 1,
//     // location: 0,
//     threshold: 0.3,
//     distance: 10,
//     // useExtendedSearch: false,
//     ignoreLocation: true,
//     // ignoreFieldNorm: false,
//     keys: [
//         "name"
//     ]
// };

// var fuse = null;

/**
 * 
 * @param {Map} emojiList, an map of of <emojiCode, emojiName>
 */
function updateEmojiList(emojiList) {
    fuse = new Fuse(emojiList, fuseOptions);
}

const port = chrome.extension.connect({
    name: fetchEmojiListPort
});
port.onMessage.addListener(updateEmojiList);
// port.postMessage({ "command": "fetchEmoji", "data": "" });

const emojiMatchPort = chrome.extension.connect({
    name: 'emojiMatchPort'
})

// emojiMatchPort.onMessage.addListener(populateResultsInputList)
emojiMatchPort.onMessage.addListener(populateResultsTable)

document.getElementById('search-form').addEventListener('submit', copyAndClosePopup)

document.getElementById('input-txt').addEventListener('onchange', copyAndClosePopup)

function copyAndClosePopup(event) {
    event.preventDefault()
    // let textNode = document.getElementById('input-area')
    // copyTextToClipboard(textNode.value)
    copyTextToClipboard(copyStr)
    window.close(); // close the popup, we're done
}
document.getElementById('search-form').addEventListener('keyup', event => {
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            updateResultTable(resultTableIdx - 1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            updateResultTable(resultTableIdx + 1);
            break;

        default:
            emojiMatchPort.postMessage({ "command": "emojiMatchString", "data": event.target.value });
            break;
    }
    // var results = fuse.search(event.target.value)
    // populateResultsTable(results)
    // console.log(event.target.value)

})

const maxResultTableLength = 15;
var resultTableIdx = 0;
var copyStr = "";

function updateResultTable(idx) {
    let table = document.getElementById('found-emojis');
    let numRows = table.rows.length
    if (numRows > 0) {
        let numCols = table.rows[0].cells.length
        idx = Math.max(Math.min(numRows, idx), 0);
        resultTableIdx = idx;
        for (var i = 0; i < numRows; ++i) {
            table.rows[i].cells[numCols - 1].style.backgroundColor = 'white';
        }
        let cell = table.rows[idx].cells[numCols - 1]
        cell.style.backgroundColor = '#00ffff69';
        copyStr = cell.innerText
    } else {
        copyStr = ""
    }


}

function populateResultsInputList(results) {
    var currentResultIdx = 0;
    var emojiArray = [];
    var table = document.getElementById('input-txt');
    table.innerHTML = "";
    for (const result in results) {
        currentResultIdx++;
        if (currentResultIdx > maxResultTableLength) {
            break;
        }
        if (Object.hasOwnProperty.call(results, result)) {
            const element = results[result].item;
            let option = document.createElement('option')
            option.value = element.name + " " + element.emoji;

            table.appendChild(option)
        }
    }
}

function populateResultsTable(results) {
    resultTableIdx = -1;
    var currentResultIdx = 0;
    var table = document.getElementById('found-emojis');
    table.innerHTML = "";
    for (const result in results) {
        currentResultIdx++;
        if (currentResultIdx > maxResultTableLength) {
            break;
        }
        if (Object.hasOwnProperty.call(results, result)) {
            const element = results[result].item;
            // console.log(`${element.name}: ${element.emoji}`)

            let row = document.createElement('tr')
            let col1 = document.createElement('td');
            col1.textContent = element.name;

            let col2 = document.createElement('td');
            col2.innerText = element.emoji

            row.appendChild(col1)
            row.appendChild(col2)
            table.appendChild(row)
        }
    }
    updateResultTable(resultTableIdx);
}


