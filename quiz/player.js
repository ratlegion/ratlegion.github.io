// Load the data var into quizJson
// see editor.js for info

function decompressJSON(json) {
    return maximiseJson(JSON.parse(inflate(json.replaceAll("-", "+").replaceAll("~", "="))));
}

function maximiseJson(json) {
    const keyMap = {
        "n": "name",
        "s": "style",
        "f": "f",
        "t": "types",
        "q": "questions",
        "d": "description",
        "o": "options",
        "w": "weight",
        "t": "type"
    };

    function transform(obj) {
        if (Array.isArray(obj)) {
            return obj.map(transform);
        } else if (typeof obj === 'object' && obj !== null) {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                const newKey = keyMap[key] || key;
                acc[newKey] = transform(value);
                return acc;
            }, {});
        }
        return obj;
    }

    let exportJson = transform(json);

    if (exportJson.f.endsWith('c')) {
        exportJson.f = exportJson.f.slice(0, -1);
    }
    return exportJson;
}

function inflate(data) {
    var binaryString = atob(data);
    var binaryData = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
    }
    var inflated = pako.inflate(binaryData);
    return new TextDecoder().decode(inflated);
}

const params = new URLSearchParams(window.location.search);

let quizJson = params.get('data');

quizJson = decompressJSON(quizJson);

setStyleToVar(quizJson.style)

//----------------
//Settup

const option = `<li><button  onclick="selectOption(this)" data-question-index="0" data-option-index="0" ><span>Test</span></button></li>`

let optionContainer = document.getElementById("question-option-container");

let votedTypes = []
let currentQuestion = 0

//----------------
//When exit title screen

function playQuiz() {
    document.getElementById('title-screen-container').classList.add("animateElement")
    playQuizAnim();
}

function playQuizAnim() {
    const animationDuration = window.getComputedStyle(document.getElementById('title-screen-container')).animationDuration;

    if (animationDuration === '0s' || animationDuration === 'none') {
        playQuizEnd();
    } else {
        setTimeout(playQuizEnd, parseFloat(animationDuration) * 1000);
    }
}

function playQuizEnd() {
    document.getElementById('title-screen-container').style.display = "none";

    document.getElementById('quiz-options-screen').style.display = "";
}

//----------------
//Load a question


function addOption() {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = option.trim();
    let optionElement = tempDiv.firstElementChild;
    optionContainer.appendChild(optionElement);
}

//----------------
//Select option

function selectOption(element) {

}