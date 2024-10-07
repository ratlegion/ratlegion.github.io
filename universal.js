//----------------
//Change the style of the page

function setStyle(element) {
    let parent = element.parentNode;

    const selectedTheme = document.getElementById('selected-theme');
    if (selectedTheme) {
        selectedTheme.removeAttribute('id');
    }
    parent.id = "selected-theme";

    const styleTheme = parent.getAttribute("data-style");
    document.getElementById("styletheme").href = "themes/" + styleTheme + "/style.css";
}

function updateStyle() {

    if(document.getElementById('selected-theme')){
        document.getElementById("styletheme").href = "themes/" + document.getElementById('selected-theme').getAttribute("data-style") + "/style.css";
    } else if(urlParams.get("style")){
        document.getElementById("styletheme").href = "themes/" + urlParams.get("style") + "/style.css";
    } else{
        document.getElementById("styletheme").href = "themes/" + "clean" + "/style.css";
    }
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

updateStyle()