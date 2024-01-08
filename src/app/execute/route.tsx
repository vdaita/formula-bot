import BRX from './../../brx-node';
// import BRX from 'brx-node';
// import { sftoq, uif } from 'brx-node';
import { NextResponse } from 'next/server';
import { sftoq, uif } from './../../brx-node';

let brx = new BRX(process.env.BRX_API_KEY!, { verbose: true })

interface BRXInputField {
    type: 'string',
    name: string,
    entry_key: string,
    value: string
}

let addKeyValuePairsToInputFields = (brx_input_fields: BRXInputField[], kv_pairs: any) => {
    for(const [key, value] of Object.entries(kv_pairs)){
        var found = false;

        for(var i = 0; i < brx_input_fields.length; i++){
            if(brx_input_fields[i].name == key){
                if(typeof value == "string"){
                    found = true;
                    brx_input_fields[i].value = value;
                } else {
                    throw `Type of value must be string for input field: ${key}`;
                }
            }
        }
        
        if(!found){
            throw `There was no matching key in the BRX input fields for ${key}`;
        }
    }
    return brx_input_fields;
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request){
    let body = await request.json();

    let brx_schema_export_string = `{"description":"abced","brxName":"create_or_explain_excel_formula","brxId":"e150667a-5094-489e-9559-14454f4b435c","dependantBrxIds":{},"schemas":{"mainBrxId":"e150667a-5094-489e-9559-14454f4b435c","schemas":{"_isMap":true,"data":[["main_brx_entry_schema",{"schemaFields":{"_isMap":true,"data":[["mode",{"fieldValueDataType":"string","fieldValue":"testval"}],["software",{"fieldValueDataType":"string","fieldValue":"testval"}],["query",{"fieldValueDataType":"string","fieldValue":"testval"}]]},"brxName":"create_or_explain_excel_formula","brxId":"e150667a-5094-489e-9559-14454f4b435c"}]]}}}`;
    let brx_query_rebuild = sftoq(brx_schema_export_string);

    console.log("BRX query rebuild: ", brx_query_rebuild)
    let outputObject = brx_query_rebuild.brxQuery;
    
    let input_fields = brx_query_rebuild.input_fields;
    input_fields = addKeyValuePairsToInputFields(
        input_fields,
        {"query": body.query, "mode": body.mode, "software": body.software}
    )

    let update_bq = await uif(input_fields, outputObject)
        
    console.log(update_bq.brxQuery)
    
    const result = await brx.execute(update_bq.brxQuery);
    return NextResponse.json({ result: result[0].brxRes.output }, { status: 200 })
}