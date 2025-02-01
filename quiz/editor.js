//----------------
// Code for adding and removing options.

const type = `<li class="type"><input placeholder="Name(must be unique)" type="text" maxlength="20" class="typeNameSelector"><br><textarea placeholder="Optional description of type" maxlength="200" cols="25" rows="4" class="typeDescriptionSelector"></textarea><br><input placeholder="Optional image URL" type="text" maxlength="100" class="typeImageSelector"><sub><a onclick="readImageNote()" href="#image-note">[READ NOTE]</a></sub><br><br><button onclick="removeParent(this)">- remove type</button><br></li>`;

//const question = `<li class="question"><br><input placeholder="Question name (must be unique)" type="text" maxlength="30" class="questionNameSelector"><br><ol class="questions-options"><li class="option"><br><input placeholder="Option name (must be unique)" type="text" maxlength="20" class="optionNameSelector"><br><select class="dynamic-option-select optionTypeSelector" onclick="onSelectClick(this)"><option>&lt; Click to add value &gt;</option></select><br><input placeholder="Optional weight" type="number" max="999" class="optionWeightSelector"><br><br><button onclick="removeParent(this)">- remove option</button><br></li></ol><br><button onclick="addOption(this)">+ add option</button><button onclick="removeParent(this)">- remove question</button></li>`;
const question = `<li class="question"><input placeholder="Question name (must be unique)" type="text" maxlength="50" class="questionNameSelector"><br><ol class="questions-options"></ol><br><button onclick="addOption(this)">+ add option</button><button onclick="removeParent(this)">- remove question</button></li>`

const option = `<li class="option"><input placeholder="Option name" type="text" maxlength="20" class="optionNameSelector"><br><select class="dynamic-option-select optionTypeSelector" onclick="onSelectClick(this)"><option>&lt; Click to add value &gt;</option></select><br><input placeholder="Optional weight" type="number" max="999" class="optionWeightSelector"><br><br><button onclick="removeParent(this)">- remove option</button><br></li>`;
const optionNoValue = `<li class="option"><input placeholder="Option name" type="text" maxlength="20" class="optionNameSelector"><br><select class="dynamic-option-select optionTypeSelector" onclick="onSelectClick(this)"></select><br><input placeholder="Optional weight" type="number" max="999" class="optionWeightSelector"><br><br><button onclick="removeParent(this)">- remove option</button><br></li>`;


let types = document.getElementById("types");
let questions = document.getElementById("questions");


function addType() {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = type.trim();
    let optionElement = tempDiv.firstElementChild;
    types.appendChild(optionElement);
}

function addQuestion() {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = question.trim();
    let optionElement = tempDiv.firstElementChild;
    questions.appendChild(optionElement);
}

function addOption(element) {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = option.trim();
    let optionElement = tempDiv.firstElementChild;
    element.parentNode.querySelector('.questions-options').appendChild(optionElement);
}


function removeParent(element) {
    element.parentNode.remove();
}

// Shows a note about images
function readImageNote() {
    document.getElementById("image-note").showModal();
}

function closeImageNote() {
    document.getElementById("image-note").close();
}

function readShareButton() {
    document.getElementById("share").showModal();
}

function closeShareButton() {
    document.getElementById("share").close();
}

//----------------
// This is for exporting the JSON

// The format of the json doesn't do anything now for now but later if I update the code I can use it to ensure compatability with quizes made before th code.
// When compressed the format has a "c" at the end
const currentFormat = "v1";

// The blank JSON, you can see examples at /SAMPLE.json and /SAMPLE-MIN.json
let quizJson = { "name": "", "f": "v1", "style": "clean", "types": [], "questions": [] }


function saveJson() {
    // Reset
    quizJson = { "name": "", "f": "", "style": "clean", "types": [], "questions": [] }

    // Set generic settings
    quizJson.name = document.getElementById("name-selector").value;
    quizJson.style = document.getElementById("selected-theme").getAttribute("data-style");
    quizJson.f = currentFormat;

    // Loop through all type elements
    document.querySelectorAll('.type').forEach(element => {
        let typeJson = {
            "name": "",
            "description": "",
            "image": ""
        }

        typeJson.name = element.querySelector('.typeNameSelector').value;
        typeJson.description = element.querySelector('.typeDescriptionSelector').value;
        typeJson.image = element.querySelector('.typeImageSelector').value;

        quizJson.types.push(typeJson);
    })

    // Loop through all question elements

    document.querySelectorAll('.question').forEach(element => {
        let questionJson = {
            "name": "",
            "options": []
        }

        questionJson.name = element.querySelector('.questionNameSelector').value;

        // Loop through all options of the current question

        element.querySelector('.questions-options').querySelectorAll(':scope > .option').forEach(question => {
            let optionJson = {
                "name": "",
                "type": 0,
                "weight": 1
            }

            optionJson.name = question.querySelector('.optionNameSelector').value;

            console.log(quizJson.types);
            // optionJson.type = quizJson.types.findIndex(item => item.name === question.querySelector('.optionTypeSelector').value);

            optionJson.type = quizJson.types.findIndex(item => item.name.toLowerCase() === question.querySelector('.optionTypeSelector').value.toLowerCase());

            optionJson.weight = clampWeight(question.querySelector('.optionWeightSelector').value);

            questionJson.options.push(optionJson);
        })

        quizJson.questions.push(questionJson);
    })


}

// Checks if the inputted value is a number between 0..999, then either clamp it, or if it's not a number set it to 1
function clampWeight(value) {
    let num = Number(value);

    if (isNaN(num)) {
        return 1;
    }

    return Math.min(Math.max(num, 0), 999);
}


// Save, then copy to clipboard.
function copyJson() {
    saveJson();
    navigator.clipboard.writeText(JSON.stringify(minimiseJson(quizJson), null, 0));
}

// Compress by minimising, removing whitespace, deflating, then converting to work in a url
function compressJSON(json) {
    return deflate(JSON.stringify(minimiseJson(json), null, 0)).replaceAll("+", "-").replaceAll("=", "~");
}

// That but reverse
function decompressJSON(json) {
    return maximiseJson(JSON.parse(inflate(json.replaceAll("-", "+").replaceAll("~", "="))));
}

// Open the project as a link
function openShareLink() {
    saveJson();
    let compressedJson = compressJSON(quizJson);

    var currentUrl = window.location.href;
    var newUrl = currentUrl.replace(/\/[^\/]*$/, '/player.html');

    newUrl += '?data=' + encodeURIComponent(compressedJson);
    var newTab = window.open(newUrl, '_blank');

    newTab.focus();
}

// I'm going to be honest, I have no clue how to use the pako lib, I just used ChatGPT and it looked right so I included it.
function deflate(data) {
    var input = new TextEncoder().encode(data);
    var deflated = pako.deflate(input);
    return btoa(String.fromCharCode.apply(null, deflated));
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



// // Shortens the json keys to be a single letter(except "f" which is already 1 letter), removes blank values, then removes whitespace.
// // Also apphends a "c" to the end of the format(key "f") to signal that it's compressed.
function minimiseJson(json) {
    const keyMap = {
        "name": "n",
        "style": "s",
        "f": "f",
        "types": "t",
        "questions": "q",
        "description": "d",
        "options": "o",
        "weight": "w",
        "type": "t"
    };

    // used chatgpt for below code
    // don't understand it but it works
    // and that's coding in a nutshell!
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

    // you can tell i did the next part because it sucks.

    let exportJson = transform(json);
    exportJson.f = exportJson.f + "c";
    return exportJson;
}

// reverse reverse! (read to the cha cha slide)
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



// Export the JSON to a file:

function downloadJSON() {
    saveJson();

    let jsonToDownload = JSON.stringify(quizJson)

    let tempDownloadLink = document.createElement("a");

    let file = new Blob([jsonToDownload], { type: 'text/plain' });

    tempDownloadLink.href = URL.createObjectURL(file);
    tempDownloadLink.download = 'quiz.jsonquiz';

    tempDownloadLink.click();
}


//----------------
// This is for importing json to the editor

// For importing quizes
function importFile() {
    const fileInput = document.getElementById('file-importer');
    const file = fileInput.files[0];    

    if (file && file.name.endsWith('.jsonquiz')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                console.log (JSON.parse(e.target.result));
                loadJson(JSON.parse(e.target.result));

            } catch (error) {
                alert('your .jsonquiz file is messed up');
            }
        };
        reader.readAsText(file);
    } else {
        alert('you need to import a .jsonquiz file');
    }
}


//Janky method of sanitizing text so you cant inject html
function sanitizeText(text) {
    let div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Remove all options
function clearEditor() {
    questions.innerHTML = "";
    types.innerHTML = "";
}

//Load json into editor
function loadJson(json) {
    clearEditor()

    document.getElementById("name-selector").value = sanitizeText(json.name);

    // Set the style if it has a style
    if (json.style) {
        const selectedTheme = document.getElementById('selected-theme');
        if (selectedTheme) {
            selectedTheme.removeAttribute('id');
        }
        document.querySelector('[data-style="' + sanitizeText(json.style) + '"]').id = 'selected-theme';
        updateStyle()
    }

    // Loop through types and add them to the dom
    json.types.forEach(currentType => {
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = type.trim();
        let optionElement = tempDiv.firstElementChild;

        optionElement.querySelector('.typeNameSelector').value = sanitizeText(currentType.name);
        optionElement.querySelector('.typeDescriptionSelector').value = sanitizeText(currentType.description);
        optionElement.querySelector('.typeImageSelector').value = sanitizeText(currentType.image);

        types.appendChild(optionElement);
    })

    // Loop through quesitons and add them to the dom
    json.questions.forEach(currentQuestion => {
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = question.trim();
        let questionElement = tempDiv.firstElementChild;

        questionElement.querySelector('.questionNameSelector').value = sanitizeText(currentQuestion.name);

        currentQuestion.options.forEach(currentOption => {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = optionNoValue.trim();
            let optionElement = tempDiv.firstElementChild;


            optionElement.querySelector('.optionNameSelector').value = sanitizeText(currentOption.name);
            optionElement.querySelector('.optionWeightSelector').value = sanitizeText(currentOption.weight);

            // select elements work diff in that they need an option to work.
            // the type stores an index to the type rather than a string (json.types[currentOption.type].name)

            let tempOption = document.createElement('option');

            // if the type is -1 then it is unset
            if (currentOption.type == -1) {
                tempOption.innerHTML = "&lt; Click to add value &gt;"
            } else {
                tempOption.innerHTML = sanitizeText(json.types[currentOption.type].name)
            }

            optionElement.querySelector('.optionTypeSelector').appendChild(tempOption)
            tempOption.select

            questionElement.querySelector('.questions-options').appendChild(optionElement);
        })

        questions.appendChild(questionElement);
    })

}

let blankJson = { "name": "", "format": "v1", "types": [{ "name": "", "description": "", "image": "" }], "questions": [{ "name": "", "options": [{ "name": "", "type": -1, "weight": 0 }] }] }

loadJson(blankJson)



//----------------
// Dynamic option stuff ~~because having options baked in would kill the dom :p~~ <- not actually sure on that may change
// Sorry for spaghetti.

let typeOptions = [];
let activeSelect = null; 

function onSelectClick(select) {
    if (activeSelect != null && activeSelect != select) {
        removeOptionsFromSelect(activeSelect);
    }
    addOptionsToSelect(select);
}

function addOptionsToSelect(select) {
    getOptionsFromTypes();

    removeOptionsFromSelect(select);

    typeOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.text = option.text
        select.add(opt);
    });

    activeSelect = select;
}

// bug where it duplicates the selected option to the start /shrug
// might need to fix or else may allow user to create invalid questions. will just block those for now.
function removeOptionsFromSelect(select) {
    if (select.options.length > 1) {
        const selectedOption = select.options[select.selectedIndex];
        const value = selectedOption.value;
        const text = selectedOption.text;

        select.innerHTML = '';

        const newOption = document.createElement('option');
        newOption.value = value;
        newOption.text = text;

        select.appendChild(newOption);
        select.value = value;
    }
}

// unused
function removeAllOptionsFromSelect(select) {
    Array.from(select.options).forEach(option => {
        option.remove();
    })
}

function getOptionsFromTypes() {
    typeOptions = [];
    Array.from(document.getElementsByClassName("typeNameSelector")).forEach((element) => {
        let newTypeOptionObject = { value: '', text: '' };
        newTypeOptionObject.value = nameToID(element.value);

        // Adds "2" to a type name if it's already seen a type with that name.
        // May not be needed as the JSON uses indexes instead of keys to save space.
        // bug where if you create more than 2 types with the same name it still duplicates names.
        if (typeOptions.some(option => option.value === newTypeOptionObject.value)) {
            element.value = element.value + " 2";
            newTypeOptionObject.value = nameToID(element.value);
        }

        newTypeOptionObject.text = element.value;
        typeOptions.push(newTypeOptionObject);
    });
}

function nameToID(name) {
    return name.toLowerCase().replaceAll(' ', '_');
}

