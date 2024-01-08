import { schema, userSchemaInteract, brx } from "./brx";
export interface queryStreamRequest {
    userSchemaInteract: userSchemaInteract;
}
export interface queryStreamResponse {
    isError?: boolean;
    errorMsg?: string;
    promptName?: string;
    promptValue?: string;
}
export interface queryHttpResponse {
    isError?: boolean;
    statusMsg?: string;
}
export interface listBrxRequest {
    start: number;
    end: number;
}
export interface brxListEntry {
    brxName: string;
    brxId: string;
    description: string;
    dependantBrxIds: Map<string, string>;
}
export interface listBrxResponse {
    brxs: brxListEntry[];
    httpResponse?: queryHttpResponse;
}
export interface getBrxSchemaRequest {
    brxId: string;
}
export interface getBrxSchemaResponse {
    userSchemaInteract: userSchemaInteract;
    httpResponse?: queryHttpResponse;
}
export declare enum modifyBrxMode {
    DELETE = 0,
    UPDATE = 1,
    CREATE = 2
}
export interface modifyBrxRequest {
    modifyBrxMode: modifyBrxMode;
    schema?: schema;
    brxId: string;
    brx?: brx;
}
export interface modifyBrxResponse {
    httpResponse?: queryHttpResponse;
}
export interface brxValidationRequest {
    userSchemaInteract: userSchemaInteract;
    brxs: brx[];
    isExecute: boolean;
}
export interface brxValidationResponse {
    isError?: boolean;
    errorMsg?: string;
    isMainResponse?: boolean;
    promptName?: string;
    promptValue?: string;
}
export interface inputfield {
    type: string;
    name: string;
    entry_key: string;
    value: string;
}
