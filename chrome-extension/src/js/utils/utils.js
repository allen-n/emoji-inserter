
/**
 * Copy's input text string to clipboard
 * @param {String} text , a text string to be coped to the clipboard
 * @return {Boolean} true if successful, else false
 * 
 */
export function copyTextToClipboard(text) {
    var returnVal = false;
    if (text) {
        var copyFrom = document.createElement('textarea');
        copyFrom.textContent = text;
        document.body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        copyFrom.blur();
        document.body.removeChild(copyFrom);
        returnVal = true;
    }
    return returnVal;
}

/**
 * Registry of message commands
 */
export var msgCommands = {
    emojiMatchString: "emojiMatchString"
}

var utils = { copyTextToClipboard, msgCommands }

export default utils;
