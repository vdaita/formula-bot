import { WebSocket as ServerWebSocket } from "ws";
import { queryStreamRequest, inputfield } from "./objects/api_interact";
import { schema, schemaField, brx, processType } from "./objects/brx";
export { userSchemaInteract, schema, schemaField, brx, processType, } from "./objects/brx";
export { brxValidationRequest, queryStreamRequest, modifyBrxRequest, modifyBrxMode, queryHttpResponse, } from "./objects/api_interact";
export declare function mapReplacer(key: string, value: any): any;
export declare function mapReviver(key: string, value: any): any;
export declare function objToMap(obj: {
    [key: string]: schema;
}): Map<string, schema>;
export declare function objToMapEntry(obj: {
    [key: string]: schemaField;
}): Map<string, schemaField>;
export declare function objToMapField(obj: {
    [key: string]: schemaField;
}): Map<string, schemaField>;
export declare function objToMapString(obj: {
    [key: string]: string;
}): Map<string, string>;
export declare function updateInputFields(input_fields: Array<inputfield>, brxQuery: any): Promise<{
    brxQuery: any;
}>;
export declare function schemaFieldsToQuery(brx_schema_export: string | object): {
    brxQuery: {
        userSchemaInteract: {
            mainBrxId: any;
            schemas: Map<string, schema>;
        };
    };
    input_fields: any[];
};
export { schemaFieldsToQuery as sftoq };
export { updateInputFields as uif };
declare class BRX {
    _CONN_STRING: string;
    _MODIFY_CONN_STRING: string;
    _sockets: Map<string, ServerWebSocket | WebSocket>;
    socket: ServerWebSocket;
    clientSocket: WebSocket;
    verbose?: boolean;
    accessToken: string;
    inBrowser: boolean;
    webhookOpenFlag: boolean;
    webhookClosedFlag: boolean;
    webhookOpenFlags: {
        [key: string]: boolean;
    };
    webhookClosedFlags: {
        [key: string]: boolean;
    };
    initalized: boolean;
    response_stream: Array<string | string>;
    use_api_key?: boolean;
    pull_legth_from_query: boolean;
    send_local?: boolean;
    constructor(accessToken: string, options?: {
        use_brx_key?: boolean;
        verbose?: boolean;
        send_local?: boolean;
    });
    initWebSocketConnection(accessToken: string): Promise<string>;
    webhookClosedTrigger(socketId: string): void;
    webhookOpenedTrigger(socketId: string): void;
    waitForWebhookOpen(socketId: string): Promise<void>;
    waitForWebhookClose(socketId: string): Promise<void>;
    socketWait: (x: number) => Promise<void>;
    execute(query: queryStreamRequest): Promise<any>;
    modify(brxid: string, userInput: object, process_in: processType): Promise<any>;
    create(brk_gen: brx, brxFieldData: schema): Promise<any>;
    validate(brxid: string, userInput: object): Promise<any>;
}
export default BRX;
