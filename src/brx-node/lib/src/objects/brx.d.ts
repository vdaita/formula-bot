export declare enum processType {
    GPT4 = 0,
    GPT4_FUNCTION = 1,
    GPT4_FUNCTION_AUTO = 2,
    BARD = 3,
    ADA_PINECONE = 4,
    PINECONE = 5,
    ADA = 6,
    GPT432K = 7,
    GPT432K_FUNCTION = 8,
    GPT4VISION = 9,
    PPLX70BONLINE = 10,
    GEMINIPV = 11
}
export interface brxPrompt {
    prompt: Map<string, string>;
}
export interface processParams {
    processType: processType;
}
export interface brx {
    brxName: string;
    brxId: string;
    description: string;
    prompt: brxPrompt;
    processParams: processParams;
    dependantBrxIds: Map<string, string>;
}
export interface schemaField {
    fieldValue?: string;
    fieldValueDataType: string;
    fieldInformation?: {
        pineconeClient?: {
            host: string;
            username: string;
            password: string;
        };
    };
}
export interface schema {
    schemaFields: Map<string, schemaField>;
    brxName: string;
    brxId: string;
}
export interface userSchemaInteract {
    mainBrxId: string;
    schemas: Map<string, schema>;
}
