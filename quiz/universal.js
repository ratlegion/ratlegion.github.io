//----------------
//Change the style of the page

// function setStyle(element) {
//     let parent = element.parentNode;

//     const selectedTheme = document.getElementById('selected-theme');
//     if (selectedTheme) {
//         selectedTheme.removeAttribute('id');
//     }
//     parent.id = "selected-theme";

//     const styleTheme = parent.getAttribute("data-style");
//     document.getElementById("styletheme").href = "themes/" + styleTheme + "/style.css";
// }

// function updateStyle() {
//     if (document.getElementById('selected-theme')) {
//         document.getElementById("styletheme").href = "themes/" + document.getElementById('selected-theme').getAttribute("data-style") + "/style.css";
//     } else if (urlParams.get("style")) {
//         document.getElementById("styletheme").href = "themes/" + urlParams.get("style") + "/style.css";
//     } else if (urlParams.get("data")) {
//         document.getElementById("styletheme").href = "themes/" + "no_css" + "/style.css";
//     } else {
//         document.getElementById("styletheme").href = "themes/" + "clean" + "/style.css";
//     }
// }

// function setStyleToVar(style) {
//     document.getElementById("styletheme").href = "themes/" + style + "/style.css";
// }

// updateStyle()

// Set the style to the style of a given element
function setStyle(element){
    let elementStyle = element.parentNode.getAttribute("data-style");
    console.log("Set style to "+elementStyle)
    applyStyle(elementStyle);
}

function applyStyle(style){

    // If this is editor mode and we have a selected themes menu, remove the current selected theme and set it the the applied style
    const selectedTheme = document.getElementById('selected-theme');
    if (selectedTheme) {
        selectedTheme.removeAttribute('id');

        let newStyle = document.querySelector('[data-style='+style+']');
        newStyle.id = "selected-theme"
    }

    document.getElementById('styletheme').href = "themes/" + style + "/style.css";
}

function addStyleExtension(style){
    
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

applyStyle('clean')


//----------------
//