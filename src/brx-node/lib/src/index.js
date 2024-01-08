"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uif = exports.sftoq = exports.schemaFieldsToQuery = exports.updateInputFields = exports.objToMapString = exports.objToMapField = exports.objToMapEntry = exports.objToMap = exports.mapReviver = exports.mapReplacer = exports.modifyBrxMode = exports.processType = void 0;
const ws_1 = require("ws");
const detect_browser_1 = require("detect-browser");
// Conditionally import readline for server-side execution Re impliment this in client package!
// const isNodeEnvironment = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
// let readline: any;
// if (isNodeEnvironment) {
//   readline = require('readline');
// }
const browser = detect_browser_1.detect();
// if (detected && detected.type) {
//       return 'client-side';
//     } else {
//       return 'server-side';
//     }
// function checkEnvironment() {
//   // Utilizing detect-browser to identify the environment
//   const detected = detect();
//   // If a browser is detected, return 'client-side', otherwise return 'server-side'
//   if (detected && detected.type) {
//     return 'client-side';
//   } else {
//     return 'server-side';
//   }
// }
// // Call the function and store the result
// const environment = checkEnvironment();
// // Log the result to the console
// console.log(`The environment is ${environment}.`);
// Importing necessary objects and types
const api_interact_1 = require("./objects/api_interact");
var brx_1 = require("./objects/brx");
Object.defineProperty(exports, "processType", { enumerable: true, get: function () { return brx_1.processType; } });
var api_interact_2 = require("./objects/api_interact");
Object.defineProperty(exports, "modifyBrxMode", { enumerable: true, get: function () { return api_interact_2.modifyBrxMode; } });
// Map Replacer and Reviver
function mapReplacer(key, value) {
    if (value instanceof Map) {
        return {
            _isMap: true,
            data: Array.from(value.entries()),
        };
    }
    else {
        return value;
    }
}
exports.mapReplacer = mapReplacer;
function mapReviver(key, value) {
    if (typeof value === "object" && value !== null) {
        if (value._isMap) {
            return new Map(value.data);
        }
    }
    return value;
}
exports.mapReviver = mapReviver;
// Object to Map Converter functions
function objToMap(obj) {
    return new Map(Object.entries(obj));
}
exports.objToMap = objToMap;
function objToMapEntry(obj) {
    return new Map(Object.entries(obj));
}
exports.objToMapEntry = objToMapEntry;
function objToMapField(obj) {
    return new Map(Object.entries(obj));
}
exports.objToMapField = objToMapField;
function objToMapString(obj) {
    return new Map(Object.entries(obj));
}
exports.objToMapString = objToMapString;
// Deprecating
// async function getUserInput(question:string) {
//   const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout
//   });
//   return new Promise<string>((resolve) => rl.question(question, (ans:any) => {
//       rl.close();
//       resolve(ans);
//   }));
// }
// export async function updateInputFieldsCLI(input_fields:Array<inputfield> , brxQuery:any){
//   for (const input of input_fields) {
//     // Get value for current input field from user 
//     if (isNodeEnvironment) {
//       const value:string = await getUserInput(`Please enter the value for ${input.name}: `);
//       input.value = value
//     }
//     // const value:string = await getUserInput(`Please enter the value for ${input.name}: `);
//     // input.value = value
//     // Update the fieldValue for current input field in the map
//     let currentSchema = brxQuery.userSchemaInteract.schemas.get(input.entry_key);
//     if (currentSchema && currentSchema.schemaFields instanceof Map) {
//       let currentField = currentSchema.schemaFields.get(`${input.name}`);
//       if (currentField) {
//         // Update the existing fieldValue
//         currentField.fieldValue = input.value; 
//       } else {
//         // fieldValue not present currently, add a new one
//         // let outString = input.value.toString()
//         currentSchema.schemaFields.set(`${input.name}`, {fieldValue: input.value});
//       }
//     }
//   }
//   return {'brxQuery':brxQuery , 'input_fields':input_fields}
// }
function updateInputFields(input_fields, brxQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const input of input_fields) {
            // Update the fieldValue for current input field in the map
            let currentSchema = brxQuery.userSchemaInteract.schemas.get(input.entry_key);
            if (currentSchema && currentSchema.schemaFields instanceof Map) {
                let currentField = currentSchema.schemaFields.get(`${input.name}`);
                if (currentField) {
                    // Update the existing fieldValue
                    currentField.fieldValue = input.value;
                }
                else {
                    // fieldValue not present currently, add a new one
                    currentSchema.schemaFields.set(`${input.name}`, { fieldValue: input.value });
                }
            }
        }
        return { 'brxQuery': brxQuery };
    });
}
exports.updateInputFields = updateInputFields;
exports.uif = updateInputFields;
function schemaFieldsToQuery(brx_schema_export) {
    // Checking if the type of brx_schema_export is a string or a JSON object.
    let json_export;
    if (typeof brx_schema_export === 'string') {
        json_export = JSON.parse(brx_schema_export);
    }
    else if (typeof brx_schema_export === 'object' && brx_schema_export !== null) {
        json_export = brx_schema_export;
    }
    let input_fields = [];
    let outputObject = {
        userSchemaInteract: {
            mainBrxId: json_export.schemas.mainBrxId,
            schemas: objToMap(json_export.schemas.schemas.data.reduce((schemas, schemaEntry) => {
                const [schemaKey, schemaData] = schemaEntry;
                const newBrxName = schemaKey;
                const schemaFields = objToMapField(schemaData.schemaFields.data.reduce((fields, fieldEntry) => {
                    const [fieldKey, fieldData] = fieldEntry;
                    input_fields.push({ type: fieldData.fieldValueDataType, name: fieldKey, entry_key: schemaKey, value: '' });
                    // Sets null defaults to feilds name
                    fields[fieldKey] = Object.assign(Object.assign({}, fieldData), { fieldValue: "" });
                    return fields;
                }, {}));
                schemas[schemaKey] = {
                    brxId: schemaData.brxId,
                    brxName: newBrxName,
                    schemaFields,
                };
                return schemas;
            }, {})),
        },
    };
    return { 'brxQuery': outputObject, 'input_fields': input_fields };
}
exports.schemaFieldsToQuery = schemaFieldsToQuery;
exports.sftoq = schemaFieldsToQuery;
// BRX class with its methods
class BRX {
    constructor(accessToken, options = { use_brx_key: true, verbose: true, send_local: false } // added default values
    ) {
        this._sockets = new Map();
        this.webhookOpenFlags = {}; // This stores the state of 'open' flags for each socket connection
        this.webhookClosedFlags = {}; // This stores the state of 'close' flags for each socket connection
        // async waitForWebhookOpen(): Promise<void> {
        //   return new Promise((resolve) => {
        //     const interval = setInterval(() => {
        //       //console.log("Inside Interval Waiting Open");
        //       if (this.webhookOpenFlag) {
        //         clearInterval(interval);
        //         this.webhookOpenFlag = false; // Reset the flag for future use
        //         resolve();
        //       }
        //     }, 100);
        //   });
        // }
        // async waitForWebhookClose(): Promise<void> {
        //   return new Promise((resolve) => {
        //     const interval = setInterval(() => {
        //       //console.log("Inside Interval Waiting Close");
        //       if (this.webhookClosedFlag) {
        //         clearInterval(interval);
        //         this.webhookClosedFlag = false; // Reset the flag for future use
        //         resolve();
        //       }
        //     }, 100);
        //   });
        // }
        // waits for a specific socket to open
        // async waitForWebhookOpen(socketId: string): Promise<void> {
        //   return new Promise((resolve) => {
        //     let socket:any = this._sockets.get(socketId);
        //     socket.on('open', () => {
        //       resolve();
        //     });
        //   });
        // }
        // // waits for a specific socket to close
        // async waitForWebhookClose(socketId: string): Promise<void> {
        //   return new Promise((resolve) => {
        //     let socket:any = this._sockets.get(socketId);
        //     socket.on('close', () => {
        //       resolve();
        //     });
        //   });
        // }
        this.socketWait = (x) => new Promise(resolve => setTimeout(resolve, x));
        let { use_brx_key, verbose, send_local } = options;
        if (use_brx_key == undefined) {
            use_brx_key = true;
        }
        if (verbose) {
            console.log("Top Level Options: ", options);
        }
        // checking if send_local is true and setting the connection string correspondingly
        this._CONN_STRING = send_local
            ? "ws://localhost:8080/query_stream"
            : "wss://api.brx.ai/query_stream";
        this._MODIFY_CONN_STRING = send_local
            ? "http://localhost:8080/modify_brx"
            : "https://api.brx.ai/modify_brx";
        // removed the if-else block and added console.log statement to log the type of connection we're using
        console.log(`██████╗ ██████╗ ██╗  ██╗
██╔══██╗██╔══██╗╚██╗██╔╝
██████╔╝██████╔╝ ╚███╔╝           Amplify not replace | https://brx.ai
██╔══██╗██╔══██╗ ██╔██╗ 
██████╔╝██║  ██║██╔╝ ██╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝                  
      
Using Package ${send_local ? "Local" : "Global"} Connection: brx.ai\nWARN: ${send_local ? "Local" : "Global"} Conn Strings enabled\n`);
        this.send_local = send_local;
        this.verbose = verbose;
        this.accessToken = accessToken;
        // console.log("-=-=--=-=-=-=" , use_brx_key)
        this.use_api_key = use_brx_key;
        // console.log("Inner Debug" , this.use_api_key)
        this.pull_legth_from_query = true;
        // Make constructor async
        this.initalized = false;
        // (async () => {
        //     await this.initWebSocketConnection(accessToken);
        //     this.initalized = true
        //   })();
    }
    initWebSocketConnection(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.webhookClosedFlag = false;
            // this.webhookOpenFlag = false;
            // Setup WebSocket connection and event listeners
            //console.log("Starting constructor");
            // Generate a unique identifier for each socket connection
            const socketId = `${Math.floor(Math.random() * 100000)}`;
            this.webhookClosedFlags[socketId] = false;
            this.webhookOpenFlags[socketId] = false;
            // handle the case where we don't detect the browser
            // if (browser.type == "node") {
            if (false) {
                if (this.verbose) {
                    console.log("Running Server Side 2", browser.type);
                }
                this.inBrowser = false;
                if (this.use_api_key) {
                    //Use Api Key
                    if (this.verbose) {
                        console.log("Using BRX Api key at auth level");
                    }
                    this.socket = new ws_1.WebSocket(this._CONN_STRING, { headers: {
                            //authorization: "Bearer q03nmv012n349tgtIlovethebots:)n2934mnsssadaadfas03mj",
                            key: `${accessToken}`,
                        } });
                    this._sockets.set(socketId, this.socket);
                }
                else {
                    //Use Firebase Auth Tokens
                    if (this.verbose) {
                        console.log("Using Firebase Auth at auth level");
                    }
                    this.socket = new ws_1.WebSocket(this._CONN_STRING, [
                        "authorization",
                        `${accessToken}`,
                    ]);
                    this._sockets.set(socketId, this.socket);
                }
                const socket = this._sockets.get(socketId);
                socket.addEventListener("open", (event) => {
                    if (this.verbose) {
                        console.log("WebSocket connection opened");
                    }
                    this.webhookOpenedTrigger(socketId); // You need to pass socketId to set the correct 'open' flag
                });
                socket.addEventListener("close", (event) => {
                    if (this.verbose) {
                        console.log("WebSocket connection closed");
                    }
                    ;
                    this.webhookClosedTrigger(socketId); // You need to pass socketId to set the correct 'close' flag
                });
                socket.addEventListener("error", (event) => {
                    if (this.verbose) {
                        console.log("WebSocket error:", event);
                    }
                    ;
                });
            }
            else {
                console.log("Running Client Side");
                this.inBrowser = true;
                if (this.use_api_key) {
                    //Use Api Key
                    //TODO: Jando Update BRX backend to support ws headers auth with brx_api_key
                    // console.log("Support For this needs to be added!!!")
                    // console.log("Using BRX Api key at auth level")
                    this.clientSocket = new WebSocket(this._CONN_STRING, [
                        "clientKey",
                        `${accessToken}`,
                    ]);
                    this._sockets.set(socketId, this.clientSocket);
                }
                else {
                    //Use Firebase Auth Tokens
                    if (this.verbose) {
                        console.log("Using Firebase Auth at auth level");
                    }
                    this.clientSocket = new WebSocket(this._CONN_STRING, [
                        "authorization",
                        `${accessToken}`,
                    ]);
                    this._sockets.set(socketId, this.clientSocket);
                }
                const clientSocket = this._sockets.get(socketId);
                clientSocket.addEventListener("open", (event) => {
                    if (this.verbose) {
                        console.log("WebSocket connection opened");
                    }
                    this.webhookOpenedTrigger(socketId); // You need to pass socketId to set the correct 'open' flag
                });
                clientSocket.addEventListener("close", (event) => {
                    if (this.verbose) {
                        console.log("WebSocket connection closed");
                    }
                    ;
                    this.webhookClosedTrigger(socketId); // You need to pass socketId to set the correct 'close' flag
                });
                clientSocket.addEventListener("error", (event) => {
                    if (this.verbose) {
                        console.log("WebSocket error:", event);
                    }
                    ;
                });
            }
            return socketId;
        });
    }
    // webhookClosedTrigger() {
    //   this.webhookClosedFlag = true;
    // }
    // webhookOpenedTrigger() {
    //   this.webhookOpenFlag = true;
    // }
    webhookClosedTrigger(socketId) {
        this.webhookClosedFlags[socketId] = true; // Set the correct 'close' flag
    }
    webhookOpenedTrigger(socketId) {
        this.webhookOpenFlags[socketId] = true; // Set the correct 'open' flag
    }
    waitForWebhookOpen(socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                // let socket: any = this._sockets.get(socketId);
                const interval = setInterval(() => {
                    //console.log("Inside Interval Waiting Open");
                    if (this.webhookOpenFlags[socketId]) {
                        clearInterval(interval);
                        this.webhookOpenFlags[socketId] = false; // Reset the flag for future use
                        resolve();
                    }
                }, 100);
                // if(this.webhookOpenFlags[socketId] === false) {  // Check the correct 'open' flag
                //   socket.on('open', () => {
                //     this.webhookOpenFlags[socketId] = false;  // Clear the correct 'open' flag after the connection opens
                //     resolve();
                //   });
                // } else {
                //   resolve();
                // }
            });
        });
    }
    waitForWebhookClose(socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                // let socket:any = this._sockets.get(socketId);
                const interval = setInterval(() => {
                    //console.log("Inside Interval Waiting Open");
                    if (this.webhookClosedFlags[socketId]) {
                        clearInterval(interval);
                        this.webhookClosedFlags[socketId] = false; // Reset the flag for future use
                        resolve();
                    }
                }, 100);
                // if(this.webhookClosedFlags[socketId] === false) {  // Check the correct 'close' flag
                //   socket.on('close', () => {
                //     this.webhookClosedFlags[socketId] = false;  // Clear the correct 'close' flag after the connection closes
                //     resolve();
                //   });
                // } else {
                //   resolve();
                // }
            });
        });
    }
    execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                console.log("Starting Execute");
                console.log("Useing Access Token: ", this.accessToken);
            }
            // Init the websockets on call for closed _sockets multi call per instance
            // await this.initWebSocketConnection(this.accessToken);
            const socketId = yield this.initWebSocketConnection(this.accessToken);
            const socket = this._sockets.get(socketId);
            if (this.verbose) {
                console.log("----====Socket Debug===---");
                console.log(socketId);
                // console.log(socket)
                console.log("-=-=-=-=-=-=-=-==-=-=-=");
            }
            if (this.verbose) {
                console.log("Websocket Initalized");
            }
            // //TODO impliment feature for auto open connection if single use
            yield this.waitForWebhookOpen(socketId);
            // // Adding Hard wait
            yield this.socketWait(1000);
            if (this.verbose) {
                console.log("Waiting Hook is open");
            }
            const brx = [];
            // Find the Expected Execution Length based on the BRX id and a schema pull
            // Or pull this data from the length of the query being passed in as an object
            // This step will determine the ammount of listerners that are resolved in place for this function
            if (this.inBrowser) {
                let response_length = 0;
                if (this.pull_legth_from_query) {
                    response_length = query.userSchemaInteract.schemas.size;
                    //console.log(query.userSchemaInteract.schemas.size)
                    // this.waitForWebhookClose();
                }
                if (this.verbose) {
                    console.log("Response Length Set to ", response_length);
                }
                const messageListener = (event) => __awaiter(this, void 0, void 0, function* () {
                    // Received a WebSocket message and add it to the messages array
                    //console.log("WebSocket message received:", event.data);
                    // let data = JSON.parse(event);
                    // console.log(data)
                    brx.push(JSON.parse(event.data));
                    // Resolve the promise if there are more than one message in the messages array
                    if (brx.length == response_length) {
                        // this.clientSocket.removeEventListener("message", messageListener);
                        socket.removeEventListener("message", messageListener);
                        // await this.waitForWebhookClose();
                        yield this.waitForWebhookClose(socketId);
                        // Send multiple values using an object, you can destructure this object
                        // later in your code when you use the result of this function
                        return brx;
                    }
                    // let data = JSON.parse(event.data);
                    // if (data.length === response_length) {
                    //   await this.waitForWebhookClose(socketId);
                    //   return data ;
                    // }
                });
                //this.socket.addEventListener("message", messageListener);
                if (this.verbose) {
                    console.log("Sending WS message");
                }
                // socket.on('message', messageListener);
                socket.send(JSON.stringify(query, mapReplacer));
                // Wait for a resolved value from the messageListener
                // This promise resolves only if there are more than one message in the messages array
                const result = yield new Promise(resolve => {
                    // socket.on('message', (event: any) => {
                    //   messageListener(event).then(resolvedValue => {
                    //     if (resolvedValue) {
                    //       resolve(resolvedValue);
                    //     }
                    //   });
                    // });
                    socket.addEventListener("message", (event) => {
                        messageListener(event).then(resolvedValue => {
                            if (resolvedValue) {
                                resolve(resolvedValue);
                            }
                        });
                    });
                });
                return result;
            }
            else {
                let response_length = 0;
                if (this.pull_legth_from_query) {
                    response_length = query.userSchemaInteract.schemas.size;
                    //console.log(query.userSchemaInteract.schemas.size)
                    // this.waitForWebhookClose();
                }
                if (this.verbose) {
                    console.log("Response Length Set to ", response_length);
                }
                const messageListener = (event) => __awaiter(this, void 0, void 0, function* () {
                    // Received a WebSocket message and add it to the messages array
                    // console.log(event)
                    // console.log("WebSocket message received:", event.data);
                    // let data = JSON.parse(event);
                    // console.log(data)
                    brx.push(JSON.parse(event));
                    // Resolve the promise if there are more than one message in the messages array
                    if (brx.length == response_length) {
                        // socket!.removeEventListener("message", messageListener);
                        // await this.waitForWebhookClose();
                        yield this.waitForWebhookClose(socketId);
                        // Send multiple values using an object, you can destructure this object
                        // later in your code when you use the result of this function
                        return brx;
                    }
                });
                //this.socket.addEventListener("message", messageListener);
                if (this.verbose) {
                    console.log("Sending WS message");
                }
                //console.log(JSON.stringify(query, mapReplacer))
                // socket.on('message', messageListener);
                socket.send(JSON.stringify(query, mapReplacer));
                if (this.verbose) {
                    console.log("After the WS is message is sent");
                }
                // Wait for a resolved value from the messageListener
                // This promise resolves only if there are more than one message in the messages array
                const result = yield new Promise(resolve => {
                    socket.on('message', (event) => {
                        //console.log("event before lister" , event)
                        messageListener(event).then(resolvedValue => {
                            if (resolvedValue) {
                                resolve(resolvedValue);
                            }
                        });
                    });
                    // socket!.addEventListener("message", (event: any) => {
                    //   messageListener(event).then(resolvedValue => {
                    //     if (resolvedValue) {
                    //       resolve(resolvedValue);
                    //     }
                    //   });
                    // });
                });
                return result;
            }
        });
    }
    // Modify method
    // Useage await brx.modify(brxid, userInput)
    modify(brxid, userInput, process_in) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("BRX Modify");
            console.log(process_in);
            return;
        });
    }
    // Create method
    // Usage await brx.create(brxid, userInput)
    // This function Currenly only works with FB auth tokens
    create(brk_gen, brxFieldData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                console.log("BRX Create");
            }
            // During this function two generation routes will be defines to control single and multi and check various pre errors
            // Single Generation no Depends
            const modifyReq = {
                modifyBrxMode: api_interact_1.modifyBrxMode.CREATE,
                brx: brk_gen,
                schema: brxFieldData,
                brxId: brk_gen.brxId,
            };
            //console.log(modifyReq)
            //console.log(this.accessToken)
            const modify_response = yield fetch(this._MODIFY_CONN_STRING, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${this.accessToken}`
                },
                body: JSON.stringify(modifyReq, mapReplacer),
            }).then((resp) => __awaiter(this, void 0, void 0, function* () {
                //console.log(JSON.stringify(await resp.json(), null, 4))
                return JSON.stringify(yield resp.json(), null, 4);
            }));
            //console.log("This is outside fetch await sequience")
            return modify_response;
        });
    }
    // Validate method
    // Usage await brx.validate(brxid, userInput)
    validate(brxid, userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose) {
                console.log("BRX Validate");
            }
            ;
            return;
        });
    }
}
// Exporting BRX class for external use
exports.default = BRX;
