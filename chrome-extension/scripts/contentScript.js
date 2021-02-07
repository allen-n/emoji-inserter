var currentNode = null // The node the currently is seeing

document.addEventListener('selectionchange', () => {
    // Grabs the node fpr the currently selected DOM element
    currentNode = document.getSelection().anchorNode
});

document.addEventListener('keyup', event => {
    // check the text content of the current selected DOM element on keyup
    // IF it matches `:`, start trying to fuzzy-match 
    if (currentNode != null) {
        console.log(event) // KeyboardEvent { isTrusted: true, key: "Backspace", code: "Backspace", keyCode: 8, ...}
        let text =  currentNode.textContent ? currentNode.textContent : currentNode.innerText
        console.log(text) // "str" || html tag (empty text)
        // console.log(`Event was ${event} Node was: ${currentNode}`)
    }
});

// TODO: Look into fuse.js for matcing: https://fusejs.io/
