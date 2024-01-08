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
const readline_1 = __importDefault(require("readline"));
const src_1 = __importDefault(require("../src"));
const src_2 = require("../src");
const src_3 = require("../src");
let input_fields = []; // Initialized input_fields as an array
let outputObject;
let brx_schema_export = '';
let brx;
brx = new src_1.default("", { verbose: true });
function getUserInput(question) {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve) => rl.question(question, (ans) => {
            rl.close();
            resolve(ans);
        }));
    });
}
function update_inputs() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const input of input_fields) {
            // Get value for current input field from user 
            const value = yield getUserInput(`Please enter the value for ${input.name}: `);
            // Update the fieldValue for current input field in the map
            let currentSchema = outputObject.userSchemaInteract.schemas.get(input.entry_key);
            if (currentSchema && currentSchema.schemaFields instanceof Map) {
                let currentField = currentSchema.schemaFields.get(`${input.name}`);
                if (currentField) {
                    // Update the existing fieldValue
                    currentField.fieldValue = value;
                }
                else {
                    // fieldValue not present currently, add a new one
                    currentSchema.schemaFields.set(`${input.name}`, { fieldValue: value });
                }
            }
        }
    });
}
const query_rebuilder = () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("starting rebuild: "  , input_fields)
    let json_export = JSON.parse(brx_schema_export);
    // let json_export:any =  brx_schema_export
    // console.log(json_export)
    outputObject = {
        userSchemaInteract: {
            mainBrxId: json_export.schemas.mainBrxId,
            schemas: src_2.objToMap(json_export.schemas.schemas.data.reduce((schemas, schemaEntry) => {
                const [schemaKey, schemaData] = schemaEntry;
                const newBrxName = schemaKey;
                const schemaFields = src_2.objToMapField(schemaData.schemaFields.data.reduce((fields, fieldEntry) => {
                    const [fieldKey, fieldData] = fieldEntry;
                    input_fields.push({ type: fieldData.fieldValueDataType, name: fieldKey, entry_key: schemaKey });
                    fields[fieldKey] = Object.assign(Object.assign({}, fieldData), { fieldValue: fieldKey });
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
});
function testCase1() {
    return __awaiter(this, void 0, void 0, function* () {
        // brx_schema_export = await getUserInput("Please enter the brx_schema_export: ");
        brx_schema_export = { "description": "This BRK adds input colors", "brxName": "Add Colors", "brxId": "590ac222-f291-4da6-9123-a4822957d155", "dependantBrxIds": { "invert_color_1": "01afd050-fe19-406b-9b83-891c48ec5198" }, "schemas": { "mainBrxId": "590ac222-f291-4da6-9123-a4822957d155", "schemas": { "_isMap": true, "data": [["main_brx_entry_schema", { "schemaFields": { "_isMap": true, "data": [["colorAdd1", { "fieldValueDataType": "string", "description": "test123" }]] }, "brxName": "Invert Color", "brxId": "01afd050-fe19-406b-9b83-891c48ec5198" }], ["invert_color_1", { "schemaFields": { "_isMap": true, "data": [["userInvertColor", { "fieldValueDataType": "string", "description": "lol123" }]] }, "brxName": "Invert Color", "brxId": "01afd050-fe19-406b-9b83-891c48ec5198" }]] } } };
        let brx_schema_export_string = `{"description":"This BRK adds input colors","brxName":"Add Colors","brxId":"590ac222-f291-4da6-9123-a4822957d155","dependantBrxIds":{"invert_color_1":"01afd050-fe19-406b-9b83-891c48ec5198"},"schemas":{"mainBrxId":"590ac222-f291-4da6-9123-a4822957d155","schemas":{"_isMap":true,"data":[["main_brx_entry_schema",{"schemaFields":{"_isMap":true,"data":[["colorAdd1",{"fieldValueDataType":"string","description":"test123"}]]},"brxName":"Invert Color","brxId":"01afd050-fe19-406b-9b83-891c48ec5198"}],["invert_color_1",{"schemaFields":{"_isMap":true,"data":[["userInvertColor",{"fieldValueDataType":"string","description":"lol123"}]]},"brxName":"Invert Color","brxId":"01afd050-fe19-406b-9b83-891c48ec5198"}]]}}}`;
        // await query_rebuilder();
        let query_rebuild = src_3.sftoq(brx_schema_export);
        console.log(query_rebuild);
        outputObject = query_rebuild.brxQuery;
        input_fields = query_rebuild.input_fields;
        // console.log("After Rebuilder")
        // console.log(input_fields)
        // let update_oo = await uifcli(input_fields , outputObject)
        let update_oo = yield src_3.uif(input_fields, outputObject);
        console.log(update_oo.brxQuery);
        // await update_inputs();
        // console.log(outputObject)
        const result = yield brx.execute(update_oo.brxQuery);
        console.log("After Execution");
        console.log(result);
    });
}
function testCase2() {
    return __awaiter(this, void 0, void 0, function* () {
        // This is testing the json object flop process
        let brx_schema_export_string = `{"description":"This BRK adds input colors","brxName":"Add Colors","brxId":"590ac222-f291-4da6-9123-a4822957d155","dependantBrxIds":{"invert_color_1":"01afd050-fe19-406b-9b83-891c48ec5198"},"schemas":{"mainBrxId":"590ac222-f291-4da6-9123-a4822957d155","schemas":{"_isMap":true,"data":[["main_brx_entry_schema",{"schemaFields":{"_isMap":true,"data":[["colorAdd1",{"fieldValueDataType":"string","description":"test123"}]]},"brxName":"Invert Color","brxId":"01afd050-fe19-406b-9b83-891c48ec5198"}],["invert_color_1",{"schemaFields":{"_isMap":true,"data":[["userInvertColor",{"fieldValueDataType":"string","description":"lol123"}]]},"brxName":"Invert Color","brxId":"01afd050-fe19-406b-9b83-891c48ec5198"}]]}}}`;
        // await query_rebuilder();
        let query_rebuild = src_3.sftoq(brx_schema_export_string);
        console.log(query_rebuild);
        outputObject = query_rebuild.brxQuery;
        input_fields = query_rebuild.input_fields;
        // console.log("After Rebuilder")
        // console.log(input_fields)
        // let update_oo = await uifcli(input_fields , outputObject)
        let update_oo = yield src_3.uif(input_fields, outputObject);
        console.log(update_oo.brxQuery);
        // await update_inputs();
        // console.log(outputObject)
        const result = yield brx.execute(update_oo.brxQuery);
        console.log("After Execution");
        console.log(result);
    });
}
function testCase3() {
    return __awaiter(this, void 0, void 0, function* () {
        // brx_schema_export = await getUserInput("Please enter the brx_schema_export: ");
        brx_schema_export = { "description": "This BRK adds input colors", "brxName": "Add Colors", "brxId": "590ac222-f291-4da6-9123-a4822957d155", "dependantBrxIds": { "invert_color_1": "01afd050-fe19-406b-9b83-891c48ec5198" }, "schemas": { "mainBrxId": "590ac222-f291-4da6-9123-a4822957d155", "schemas": { "_isMap": true, "data": [["main_brx_entry_schema", { "schemaFields": { "_isMap": true, "data": [["colorAdd1", { "fieldValueDataType": "string", "description": "test123" }]] }, "brxName": "Invert Color", "brxId": "01afd050-fe19-406b-9b83-891c48ec5198" }], ["invert_color_1", { "schemaFields": { "_isMap": true, "data": [["userInvertColor", { "fieldValueDataType": "string", "description": "lol123" }]] }, "brxName": "Invert Color", "brxId": "01afd050-fe19-406b-9b83-891c48ec5198" }]] } } };
        let brx_schema_export_string = `{"description":"This BRK adds input colors","brxName":"Add Colors","brxId":"590ac222-f291-4da6-9123-a4822957d155","dependantBrxIds":{"invert_color_1":"01afd050-fe19-406b-9b83-891c48ec5198"},"schemas":{"mainBrxId":"590ac222-f291-4da6-9123-a4822957d155","schemas":{"_isMap":true,"data":[["main_brx_entry_schema",{"schemaFields":{"_isMap":true,"data":[["colorAdd1",{"fieldValueDataType":"string","description":"test123"}]]},"brxName":"Invert Color","brxId":"01afd050-fe19-406b-9b83-891c48ec5198"}],["invert_color_1",{"schemaFields":{"_isMap":true,"data":[["userInvertColor",{"fieldValueDataType":"string","description":"lol123"}]]},"brxName":"Invert Color","brxId":"01afd050-fe19-406b-9b83-891c48ec5198"}]]}}}`;
        // await query_rebuilder();
        let query_rebuild = src_3.sftoq(brx_schema_export);
        console.log(query_rebuild);
        outputObject = query_rebuild.brxQuery;
        input_fields = query_rebuild.input_fields;
        // Simulates updating the inputfeilds
        for (const input of input_fields) {
            // Get value for current input field from user 
            const value = yield getUserInput(`Please enter the value for ${input.name}: `);
            input.value = value;
        }
        let update_oo = yield src_3.uif(input_fields, outputObject);
        console.log(update_oo.brxQuery);
        const result = yield brx.execute(update_oo.brxQuery);
        console.log("After Execution");
        console.log(result);
    });
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield testCase1();
        // await testCase2()
        // await testCase3()
        console.log("Exiting Main....");
    });
}());
