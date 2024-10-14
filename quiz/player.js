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

let compQuizJson = params.get('data');

let quizJson = null

if (compQuizJson == null) {
    document.getElementById("loading-menu").style.display = "none";
    document.getElementById("upload-quiz").style.display = "";
} else {
    quizJson = decompressJSON(compQuizJson);

    setStyleToVar(quizJson.style)
}



//----------------
//Settup

const option = `<li><button  onclick="selectOption(this)" data-question-index="0" data-option-index="0" ><span>Test</span></button></li>`

let optionContainer = document.getElementById("question-option-container");
let typeContainer = document.getElementById('type-showcase-container');

let votedTypes = {};
let wonType = null;

let currentQuestion = 0;

const allowedDomains = ['i.ibb.co', 'imgur.com', 'files.catbox.moe'];

//----------------
//Exit loading screen and enter title screen

function exitLoadingScreen() {

    if (quizJson.name) {
        document.getElementById('quiz-name').innerText = quizJson.name;
    }

    if (quizJson.description) {
        document.getElementById('quiz-description').innerText = quizJson.description;
    }

    document.getElementById("loading-menu").style.display = "none";
    document.getElementById('title-screen-container').style.display = "";
}

if (quizJson !== null) {
    exitLoadingScreen()
}

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
    document.getElementById('question-quiz-name').innerText = quizJson.name;

    loadQuestion(currentQuestion)
}

//----------------
//Load a question

//Janky method of sanitizing text so you cant inject html
function sanitizeText(text) {
    let div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

function sanitizeImage(img) {

    try {
        const url = new URL(img);
        if (allowedDomains.includes(url.hostname)) {
            return img;
        } else {
            throw new Error('Image source not allowed.');
        }
    } catch (e) {
        return null;
    }
}


function loadQuestion(questionToLoad) {
    //clear all options

    optionContainer.innerHTML = '';

    const questionName = sanitizeText(quizJson.questions[questionToLoad].name)

    document.getElementById('question-name').innerText = questionName;

    //Add options to dom
    for (let i = 0; i < quizJson.questions[questionToLoad].options.length; i++) {

        let currentQuestionData = quizJson.questions[questionToLoad].options[i];

        addOption(currentQuestionData.name, questionToLoad, i);
    }
}

function addOption(text, questionIndex, optionIndex) {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = option.trim();
    let optionElement = tempDiv.firstElementChild;
    // innerText over innerHTML because the latter can be used to inject code
    optionElement.querySelector("span").innerText = text

    optionElement.querySelector("button").dataset.questionIndex = questionIndex;

    optionElement.querySelector("button").dataset.optionIndex = optionIndex;


    optionContainer.appendChild(optionElement);
}

//----------------
//Select option

function selectOption(element) {
    let thisOption = quizJson.questions[element.dataset.questionIndex].options[element.dataset.optionIndex];


    if (votedTypes.hasOwnProperty(thisOption.type)) {
        votedTypes[thisOption.type] += thisOption.weight;
    } else {
        votedTypes[thisOption.type] = thisOption.weight;
    }


    // Below is written by ChatGPT and I don't understand it but it works /shrug

    let highestValue = -Infinity;

    for (const [key, value] of Object.entries(votedTypes)) {
        if (value > wonType) {
            wonType = value;
            wonType = key;
        }
    }


    // If there are more questions continue the quiz
    if (quizJson.questions.length - 1 != currentQuestion) {
        console.log("continueing quiz")
        currentQuestion++;
        loadQuestion(currentQuestion);
    } else {
        document.getElementById('quiz-options-screen').style.display = "none";

        showTypeAnim()
    }

}

//----------------
//Finish and show answer type

function showTypeAnim() {
    //For some reason type is unpluralised
    document.getElementById("question-type-name").innerText = sanitizeText(quizJson.type[wonType].name)
    document.getElementById("type-text").innerText = sanitizeText(quizJson.type[wonType].description)
    let typeImage = sanitizeImage(quizJson.type[wonType].image);
    if (typeImage !== null) {
        document.getElementById("type-image").src = typeImage
    }


    typeContainer.style.display = '';

    typeContainer.classList.add('animateElement');

    const animationDuration = window.getComputedStyle(typeContainer).animationDuration;

    if (animationDuration === '0s' || animationDuration === 'none') {
        showTypeEnd();
    } else {
        setTimeout(showTypeEnd, parseFloat(animationDuration) * 1000);
    }
}

function showTypeEnd() {
    document.getElementById('after-popup').classList.add('visible');
    document.getElementById('after-popup').style.display = '';
}


//----------------
//Upload file button

function importFile() {
    const fileInput = document.getElementById('file-importer');
    const file = fileInput.files[0];

    if (file && file.name.endsWith('.jsonquiz')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                quizJson = JSON.parse(e.target.result);

                document.getElementById("upload-quiz").style.display = "none";

                setStyleToVar(quizJson.style);

                exitLoadingScreen();
            } catch (error) {
                alert('your .jsonquiz file is messed up');
            }
        };
        reader.readAsText(file);
    } else {
        alert('you need to import a .jsonquiz file');
    }
}