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

function setStyleToVar(style) {
    document.getElementById("styletheme").href = "themes/" + style + "/style.css";
}

// updateStyle()

// Set the style to the style of a given element
function setStyle(element) {
    let elementStyle = element.parentNode.getAttribute("data-style");
    console.log("Set style to " + elementStyle)
    applyStyle(elementStyle);
}

function applyStyle(style) {

    // If this is editor mode and we have a selected themes menu, remove the current selected theme and set it the the applied style
    const selectedTheme = document.getElementById('selected-theme');
    if (selectedTheme) {
        selectedTheme.removeAttribute('id');

        let newStyle = document.querySelector('[data-style=' + style + ']');
        newStyle.id = "selected-theme";
    }

    document.getElementById('styletheme').href = "themes/" + style + "/style.css";

    addStyleExtension(style);
}

function addStyleExtension(style) {
    //<link rel="stylesheet" class="extends-styles" id="extends-styles-1" href="">

    let currentExtendsStyle = Array.from(document.getElementsByClassName('extends-styles'));
    currentExtendsStyle.forEach(element => {
        element.remove();
    });

    let newStyles = null;

    (async function () {
        const response = await fetch('https://raw.githubusercontent.com/ratlegion/ratlegion.github.io/master/quiz/themes/' + style + '/settings.json')
        const settingsJson = await response.json();
        newStyles = settingsJson;

        console.log(newStyles)

        for (let i = 0; i < newStyles.extends.length; i++) {
            let insertStyle = document.createElement("link");
            insertStyle.rel = 'stylesheet';
            insertStyle.className = 'extends-styles';
            insertStyle.id = 'extends-styles-' + i;
            insertStyle.href = 'themes/' + newStyles.extends[i] + '/style.css';

            document.head.appendChild(insertStyle);
        }

        // push main style to the bottom:

        let styleElement = document.getElementById('styletheme');

        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
            document.head.appendChild(styleElement);
        }
    })();





}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

applyStyle('clean')


//----------------
//