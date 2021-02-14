import '../img/icon-128.png'
import '../img/icon-34.png'
import '../resources/AllEmojis.txt'

import $ from 'jquery';
import Fuse from 'fuse.js';
import { msgCommands } from "./utils/utils";

var globals = {}; // global variable container
globals.emojiJSON = null; // JSON object containing emoji in the form {"name": "grinning face", "emoji": "\ud83d\ude00", "tags": ["grinning", "face"], "category": ""}
globals.fuse = null; // Fuse object for searching


/**
 * Take an input string and search the local emoji database for matching emoji, which are returned as 
 * an object to the callback function
 * @param {String} string a string to be searched for in the emoji text descriptions
 * @param {Function} callback a callback function to be called after the search is complete, 
 * and passed the results of the Fuse.search() call
 */
function getMatchingEmojis(string, callback) {
    var results = null;
    if (globals.emojiJSON != null) {
        globals.fuse = makeSearchIndex(globals.fuse, globals.emojiJSON);
        results = globals.fuse.search(string)
        callback(results)
    } else {
        $.getJSON(chrome.runtime.getURL("./AllEmojis.txt"), data => {
            globals.fuse = makeSearchIndex(globals.fuse, data);
            results = globals.fuse.search(string)
            callback(results)
        })
    }
}


/**
 * Returns a Fuse.js search index object
 * @param {Fuse} inIndexVar, a variable containing fuse index or null
 * @param {*} data , a textfile to be converted to a fuse search index in inIndexVar
 * @return {Fuse} a fuse index, pointer to inIndexVar
 */
function makeSearchIndex(inIndexVar, data) {

    if (inIndexVar == null) {
        const fuseOptions = {
            isCaseSensitive: false,
            // includeScore: false,
            // shouldSort: true,
            includeMatches: false,
            findAllMatches: true,
            // minMatchCharLength: 1,
            // location: 0,
            threshold: 0.3,
            distance: 10,
            useExtendedSearch: true,
            ignoreLocation: true,
            // ignoreFieldNorm: false,
            keys: [
                "name",
                "tags"
            ]
        };
        inIndexVar = new Fuse(data, fuseOptions)
    }
    return inIndexVar;
}

// Chrome Runtime Listeners

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        switch (msg.command) {
            case msgCommands.emojiMatchString:
                getMatchingEmojis(msg.data, matchingEmojiList => {
                    port.postMessage(matchingEmojiList)
                })
                break;
            default:
                console.warn(`Unrecognized message sent to background.js: ${msg}`)
                break;
        }
    });
})
chrome.runtime.onInstalled.addListener(e => {
    console.log("emoji-insterter background started up!")
    console.log(e)
})
