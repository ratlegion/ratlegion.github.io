const parscript = {
    main: {
        function: [
            {
                type: "function",
                name: "print",
                parameters: ["Starting dialog"]
            },
            {
                type: "defineVar",
                name: "timesTalked",
                value: 0
            },
            {
                type: "label",
                name: "start"
            },
            {
                type: "function",
                name: "turn",
                parameters: [180]
            },
            {
                type: "function",
                name: "say",
                parameters: ["Hello adventurer!"]
            },
            {
                type: "function",
                name: "turnAround",
                parameters: []
            },
            {
                type: "flow",
                name: "ask",
                parameters: [
                    "Have you played before?",
                    "Yes",
                    "No"
                ],
                branches: {
                    main: [
                        {
                            type: "flow",
                            name: "if",
                            parameters: [
                                {
                                    type: "operator",
                                    left: {
                                        type: "variable",
                                        name: "timesTalked"
                                    },
                                    mode: ">",
                                    right: 0
                                }
                            ],
                            branches: {
                                main: [
                                    {
                                        type: "function",
                                        name: "say",
                                        parameters: [
                                            {
                                                type: "operator",
                                                left: "Great! (",
                                                mode: "+",
                                                right: {
                                                    type: "operator",
                                                    left: {
                                                        type: "variable",
                                                        name: "timesTalked"
                                                    },
                                                    mode: "+",
                                                    right: ")"
                                                }
                                            }
                                        ]
                                    }
                                ],
                                else: [
                                    {
                                        type: "function",
                                        name: "say",
                                        parameters: "Great!"
                                    }
                                ]
                            }
                        },
                        {
                            type: "increment",
                            name: "timesTalked",
                            value: 1
                        },
                        {
                            type: "jump",
                            name: "start"
                        }
                    ],
                    "1": [
                        {
                            type: "function",
                            name: "say",
                            parameters: ["I'll show you the ropes!"]
                        },
                        {
                            type: "function",
                            name: "tutorial",
                            global: true,
                            parameters: []
                        }
                    ]
                }
            }
        ]
    },
    turnAround: {
        function: [
            {
                type: "function",
                name: "wait",
                parameters: [5]
            },
            {
                type: "function",
                name: "turn",
                parameters: [0]
            },
            {
                type: "function",
                name: "wait",
                parameters: [60]
            },
            {
                type: "function",
                name: "turn",
                parameters: [180]
            }
        ]
    }
}


const scriptFunctions = {
    game: {
        print: (parameters) => {
            console.log(parameters[0])
        },
    }
};

// Extend some function scopes to create new ones
{
    // Extend game to create actor
    const actorFunctions = Object.create(scriptFunctions);
    Object.assign(actorFunctions, {
        moveTo: (parameters) => {
            console.log(`Moving to ${parameters[0]}, ${parameters[1]}`)
        },
    });
    scriptFunctions.actor = actorFunctions
}

class Script {

    constructor(script, scriptType, scope) {

        this.scope = scope || "game";

        this.scriptInput = script || {};
        this.scriptInputType = scriptType;

        this.script = this.scriptInput;
    }

    runBlocks(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            this.runBlock(blocks[i]);
        }
    }

    runBlock(block) {
        console.log(block);
    }

    // runScriptFunction(block) {
    //     // For a block to be valid, the type of the block must be an object, the .type value must be a function, and the .parameters must be an array
    //     if (typeof block === "object" && block.type === "function" && Array.isArray(block.parameters)) {
    //         if (block.global !== true) {
    //             const builtinFunc = scriptFunctions[this.scope][block.name];

    //             if (typeof builtinFunc === "function") {
    //                 return builtinFunc(block.parameters);
    //             } else {
    //                 const localScript = this.script[block.name]
    //                 if (typeof localScript === "function") {

    //                 } else {
    //                     return { type: "error", message: "Function not found" }
    //                 }
    //             }

    //         } else {

    //         }
    //     }
    // }
}

let p = new Script(parscript, "json", "actor");
p.runBlocks(parscript.main.function)

