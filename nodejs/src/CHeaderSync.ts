
import fs = require("fs");
import { getFunctions, FoundFunction } from "./CFunctionParser";

export function syncFromToText(fromCode:string, toCode:string) : string
{
    let outputCode = "";

    function processFunctions(code:string) : [FoundFunction[], Map<string, FoundFunction>] {
        let funcs = getFunctions(code);
        let funcMap = new Map<string,FoundFunction>();
        for (const func of funcs) {
            funcMap.set(func.functionName, func);
        }
        return [funcs, funcMap];
    }

    let [_, fromFuncMap] = processFunctions(fromCode);
    let [toFuncs, toFuncMap] = processFunctions(toCode);

    for (const func of toFuncs) {
        let sourceFunc = fromFuncMap.get(func.functionName);

        if (sourceFunc && hasDoxygenComment(sourceFunc))
        {
            outputCode += func.beforeLastComment + sourceFunc.touchingComment + func.functionMatch + func.after;
        } else {
            outputCode += func.before + func.functionMatch + func.after;
        }
    }

    outputCode.replace(/\n/g, "\r\n");

    return outputCode;
}

let fromCode = fs.readFileSync("test/file1.c").toString();
let toCode = fs.readFileSync("test/file1.h").toString();




let output = syncFromToText(fromCode, toCode);

console.log(output);

fs.writeFileSync("test/file1.h", output);

console.log("done!");

function hasDoxygenComment(sourceFunc: FoundFunction) {
    return sourceFunc.touchingComment.match(/^\/[*][*][^*]|^\/{3}[^\/]/);
}
