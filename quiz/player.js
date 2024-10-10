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