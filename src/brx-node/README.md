# brx-node 

![brx-node logo](https://github.com/Brx-ai/media/assets/134740746/63f3508c-f5d6-44b6-8152-e4eb9fcc78f1)

## Status
[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]

> BRX-NODE.js offical interaction Module

`brx-node` is the official interaction module for BRX-NODE.js. It is used for interacting with the BRX AI API and includes functionalities such as sending requests and receiving responses.

We're currently in BETA expect package changes and improvements in the future!

You can install `brx-node` using the following commands:

## Install

For npm:
```bash
npm install brx-node -s
```

For yarn:
```bash
yarn install brx-node -s
```

For pnpm:
```bash
pnpm install brx-node -D
```

## Usage 

Here is how you can interact with the BRX AI API using this module:

```ts
import BRX from 'brx-node';

const brx = new BRX(process.env.CUR_API_KEY!, { verbose: true });

const result = await brx.execute(query);

//=> 'Response from BRX'
```

## CLI terminal Example for query rebuilds
```ts
import readline from 'readline';
import BRX from 'brx-node';
import { objToMap, objToMapField } from 'brx-node';

let input_fields: any[] = [];  // Initialized input_fields as an array
let outputObject:any;
let brx_schema_export:any = '';

let brx;

brx = new BRX("BRX-API-KEY", { verbose:true });

async function getUserInput(question:string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise<string>((resolve) => rl.question(question, (ans) => {
        rl.close();
        resolve(ans);
    }));
}

async function update_inputs() {
  for (const input of input_fields) {
    // Get value for current input field from user 
    const value = await getUserInput(`Please enter the value for ${input.name}: `);
  
    // Update the fieldValue for current input field in the map
    let currentSchema = outputObject.userSchemaInteract.schemas.get(input.entry_key);
  
    if (currentSchema && currentSchema.schemaFields instanceof Map) {
      let currentField = currentSchema.schemaFields.get(`${input.name}`);

      if (currentField) {
        // Update the existing fieldValue
        currentField.fieldValue = value; 
      } else {
        // fieldValue not present currently, add a new one
        currentSchema.schemaFields.set(`${input.name}`, {fieldValue: value});
      }
    }
  }
}

const query_rebuilder = async () => {
  // console.log("starting rebuild: "  , input_fields)
  let json_export:any = JSON.parse(brx_schema_export)
  // let json_export:any =  brx_schema_export
  // console.log(json_export)
  outputObject = {
      userSchemaInteract: {
        mainBrxId: json_export.schemas.mainBrxId,
        schemas: objToMap(
          json_export.schemas.schemas.data.reduce((schemas:any, schemaEntry:any) => {
            const [schemaKey, schemaData] = schemaEntry;
            const newBrxName = schemaKey;

            const schemaFields = objToMapField(
              schemaData.schemaFields.data.reduce((fields:any, fieldEntry:any) => {
                const [fieldKey, fieldData] = fieldEntry;          
                input_fields.push({ type: fieldData.fieldValueDataType, name: fieldKey , entry_key: schemaKey })
                             
                fields[fieldKey] = { ...fieldData, fieldValue: fieldKey };
                return fields;
              }, {})
            );

            schemas[schemaKey] = {
              brxId: schemaData.brxId,
              brxName: newBrxName,
              schemaFields,
            };

            return schemas;
          }, {})
        ),
      },
    };
}

(async function() {
    brx_schema_export = await getUserInput("Please enter the brx_schema_export: ");

    await query_rebuilder();

    // console.log("After Rebuilder")
    // console.log(input_fields)

    await update_inputs();

    console.log(outputObject)

    const result = await brx.execute(outputObject);
    console.log("After Execution");
    console.log(result);
}());
```

## Functions

The main class in this module is `BRX`. Here are the functions that you can use:

### BRX.constructor(accessToken: string, options?: { use_brx_key?: boolean, verbose?: boolean, send_local?: boolean }): BRX

Creates an instance of the `BRX` class. 

Parameters:
- `accessToken` (`string`): The access token to interact with the BRX AI API.
- `options` (`object`): An optional parameter for various options. The fields can be:
  - `use_brx_key` (`boolean`): Whether to use the BRX API key for authorization. Default is `true`.
  - `verbose` (`boolean`): Whether to log additional details. Default is `false`.
  - `send_local` (`boolean`): Whether to use a local connection string. Default is `false`.

Example:
```ts
const brx = new BRX("your_access_token", { verbose: true, send_local: false });
```

### BRX.execute(query: queryStreamRequest): Promise<any>

Executes a given query and returns a promise for the response.

Parameters:
- `query` (`queryStreamRequest`): The query you want to execute.

Example:
```ts
const result = await brx.execute(query);
```

### BRX.modify(brxid: string, userInput: object , process_in:processType): Promise<any>

**Under construction, check future versions for implementation**

### BRX.create(brk_gen:brx , brxFieldData:schema): Promise<any>

Create schema for your BRX.

Parameters:
- `brk_gen` (`brx`): BRX generation data
- `brxFieldData`(`schema`): Schema data for fields in BRX

Example:
```ts
await brx.create(brx_gen, brxFieldData);
```

### BRX.validate(brxid: string, userInput: object): Promise<any>

**Under construction, check future versions for implementation**

## Objects

Several different objects are imported and used within the `BRX` class. These objects include `brx`, `schema`, `userSchemaInteract` and many more. See the enclosed object files 'brx.ts' and 'api.interact.ts' for detailed information on all these objects and their properties.

[build-img]:https://github.com/Brx-ai/brx-node/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/Brx-ai/brx-node/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/brx-node
[downloads-url]:https://www.npmtrends.com/brx-node
[npm-img]:https://img.shields.io/npm/v/brx-node
[npm-url]:https://www.npmjs.com/package/brx-node
[issues-img]:https://img.shields.io/github/issues/Brx-ai/brx-node
[issues-url]:https://github.com/Brx-ai/brx-node/issues
[codecov-img]:https://codecov.io/gh/Brx-ai/brx-node/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/Brx-ai/brx-node
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/