import "../css/popup.css";
import hello from "./popup/example";



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

// document.getElementById('test-img').addEventListener('click', copyTextToClipboard);
// document.getElementById('input-txt').addEventListener('focus', e => {
//     this.select()
// })
// console.log(document.getElementById('search-form'))
document.getElementById('search-form').addEventListener('submit', event => {
    // event.preventDefault()
    // console.log(event)
    let textNode = document.getElementById('input-txt')
    copyTextToClipboard(textNode.value)
    window.close(); // close the popup, we're done
})
document.getElementById('input-txt').addEventListener('keyup', event => {
    console.log(event.target.value);
})
