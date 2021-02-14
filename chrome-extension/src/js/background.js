import '../img/icon-128.png'
import '../img/icon-34.png'
import '../resources/AllEmojis.txt'

const $ = require("jquery");
import Fuse from 'fuse.js'

var emojiJSON = null;
var fuse = null;

chrome.runtime.onConnect.addListener(function (port) {
    // console.log(`Connected .....`);
    // console.log(port)

    port.onMessage.addListener(function (msg) {
        // console.log("message recieved: ");
        // console.log(msg);
        switch (msg.command) {
            case 'fetchEmoji':
                getAllEmojis(emojiList => {
                    port.postMessage(emojiList)
                })
            case 'emojiMatchString':
                getMatchingEmojis(msg.data, matchingEmojiList => {
                    port.postMessage(matchingEmojiList)
                })
                break;
            default:
                getMatchingEmojis(msg)
                break;
        }
        // port.postMessage(getMatchingEmojis(msg));
    });
})
chrome.runtime.onInstalled.addListener(e => {
    console.log("emoji-insterter background started up!")
    console.log(e)
})

function getAllEmojis(callback) {
    if (emojiJSON != null) {
        callback(emojiJSON)
    } else {
        $.getJSON(chrome.runtime.getURL("./AllEmojis.txt"), data => {
            emojiJSON = data;
            callback(data);
        })
    }
}

function getMatchingEmojis(string, callback) {
    var results = null;
    if (emojiJSON != null) {
        fuse = makeSearchIndex(fuse, emojiJSON);
        results = fuse.search(string)
        callback(results)
    } else {
        $.getJSON(chrome.runtime.getURL("./AllEmojis.txt"), data => {
            fuse = makeSearchIndex(fuse, data);
            results = fuse.search(string)
            callback(results)
        })
    }
}


/**
 * 
 * @param {Fuse} inIndexVar, a inValue fuse index, is either null or filled 
 * @param {*} data , a textfile to be converted to a fuse search index in inIndexVar
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

function getSearchIndexMatches(string) {
    if (fuse == null) {
        fuse = new Fuse()
    }
}