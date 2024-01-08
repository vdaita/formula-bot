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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const src_2 = require("../src");
require("dotenv/config"); // This assumes objToMap and objToMapField functions are imported from '../utils'
console.log("Starting Fast test.....");
console.log(process.env.CUR_FIREBASE_TOKEN);
let toggleToken = true; // Toggle this boolean based on the type of key you want to use for initialization
let verbose = false; // This stands for verbose output, adjust according to your needs
let brx;
if (toggleToken) {
    console.log("Init with API key");
    brx = new src_1.default("", { use_brx_key: true, verbose: true, send_local: true });
}
else {
    console.log("Init with Firebase key");
    brx = new src_1.default("", { use_brx_key: false, verbose: true, send_local: true });
}
// Gemini Test
// const queryIn = {
//     userSchemaInteract: {
//         mainBrxId: 'c5efb6f2-e2b7-46b2-a09e-d28041da77e6',
//         schemas: objToMap({
//             main_brx_entry_schema: {
//                 brxId: 'c5efb6f2-e2b7-46b2-a09e-d28041da77e6',
//                 brxName: "gemini_testing",
//                 schemaFields: objToMapField({
//                     test_input: {
//                         fieldValue: "What colors are these dresses from left to right?",
//                         fieldValueDataType: "string",
//                     }
//                 }),
//             },
//         }),
//     },
// };
// GPT4 Test
const queryIn1 = {
    userSchemaInteract: {
        mainBrxId: '9708bd79-5313-47ab-9c1e-3864b83d9228',
        schemas: src_2.objToMap({
            main_brx_entry_schema: {
                brxId: '9708bd79-5313-47ab-9c1e-3864b83d9228',
                brxName: "brx32kregtest",
                schemaFields: src_2.objToMapField({
                    brx_brx_brx: {
                        fieldValue: "Heyo",
                        fieldValueDataType: "string",
                    }
                }),
            },
        }),
    },
};
let queryIn2 = {
    userSchemaInteract: {
        mainBrxId: "590ac222-f291-4da6-9123-a4822957d155",
        schemas: src_2.objToMap({
            invert_color_1: {
                brxId: "01afd050-fe19-406b-9b83-891c48ec5198",
                brxName: "InvertColor",
                schemaFields: src_2.objToMapField({
                    userInvertColor: {
                        fieldValue: "red yellowblue shiny",
                        fieldValueDataType: "string",
                    },
                }),
            },
            main_brx_entry_schema: {
                brxId: "590ac222-f291-4da6-9123-a4822957d155",
                brxName: "colorAddition",
                schemaFields: src_2.objToMapField({
                    colorAdd1: {
                        fieldValue: "redishgreen yellow",
                        fieldValueDataType: "string",
                    },
                }),
            },
        }),
    },
};
const queryIn3 = {
    userSchemaInteract: {
        mainBrxId: '9708bd79-5313-47ab-9c1e-3864b83d9228',
        schemas: src_2.objToMap({
            main_brx_entry_schema: {
                brxId: '9708bd79-5313-47ab-9c1e-3864b83d9228',
                brxName: "brx32kregtest",
                schemaFields: src_2.objToMapField({
                    brx_brx_brx: {
                        fieldValue: "But why?",
                        fieldValueDataType: "string",
                    }
                }),
            },
        }),
    },
};
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Store start time
        const startTime = Date.now();
        // Execute functions and store the results
        const result1Promise = brx.execute(queryIn1);
        const result2Promise = brx.execute(queryIn2);
        const result3Promise = brx.execute(queryIn3);
        // Wait for all promises to be resolved
        // const [result1] = await Promise.all([result1Promise]);
        const [result1, result2, result3] = yield Promise.all([result1Promise, result2Promise, result3Promise]);
        // Store end time
        const endTime = Date.now();
        // Calculate elapsed time
        const elapsedTime = endTime - startTime;
        // Log the results
        console.log("After Execution");
        // console.log(result1);
        console.log(result1, result2, result3);
        // Log elapsed time
        console.log(`Elapsed time: ${elapsedTime} milliseconds`);
    });
}());
