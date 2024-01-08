"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processType = void 0;
var processType;
(function (processType) {
    processType[processType["GPT4"] = 0] = "GPT4";
    processType[processType["GPT4_FUNCTION"] = 1] = "GPT4_FUNCTION";
    processType[processType["GPT4_FUNCTION_AUTO"] = 2] = "GPT4_FUNCTION_AUTO";
    processType[processType["BARD"] = 3] = "BARD";
    processType[processType["ADA_PINECONE"] = 4] = "ADA_PINECONE";
    processType[processType["PINECONE"] = 5] = "PINECONE";
    processType[processType["ADA"] = 6] = "ADA";
    processType[processType["GPT432K"] = 7] = "GPT432K";
    processType[processType["GPT432K_FUNCTION"] = 8] = "GPT432K_FUNCTION";
    processType[processType["GPT4VISION"] = 9] = "GPT4VISION";
    processType[processType["PPLX70BONLINE"] = 10] = "PPLX70BONLINE";
    processType[processType["GEMINIPV"] = 11] = "GEMINIPV";
})(processType = exports.processType || (exports.processType = {}));
