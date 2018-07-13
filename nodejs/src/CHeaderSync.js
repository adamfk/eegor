"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const CFunctionParser_1 = require("./CFunctionParser");
function syncFromToText(fromCode, toCode) {
    let outputCode = "";
    function processFunctions(code) {
        let funcs = CFunctionParser_1.getFunctions(code);
        let funcMap = new Map();
        for (const func of funcs) {
            funcMap.set(func.functionName, func);
        }
        return [funcs, funcMap];
    }
    let [_, fromFuncMap] = processFunctions(fromCode);
    let [toFuncs, toFuncMap] = processFunctions(toCode);
    for (const func of toFuncs) {
        let sourceFunc = fromFuncMap.get(func.functionName);
        if (sourceFunc && hasDoxygenComment(sourceFunc)) {
            outputCode += func.beforeLastComment + sourceFunc.touchingComment + func.functionMatch + func.after;
        }
        else {
            outputCode += func.before + func.functionMatch + func.after;
        }
    }
    outputCode.replace(/\n/g, "\r\n");
    return outputCode;
}
exports.syncFromToText = syncFromToText;
let fromCode = fs.readFileSync("test/file1.c").toString();
let toCode = fs.readFileSync("test/file1.h").toString();
let output = syncFromToText(fromCode, toCode);
console.log(output);
fs.writeFileSync("test/file1.h", output);
console.log("done!");
function hasDoxygenComment(sourceFunc) {
    return sourceFunc.touchingComment.match(/^\/[*][*][^*]|^\/{3}[^\/]/);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ0hlYWRlclN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDSGVhZGVyU3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlCQUEwQjtBQUMxQix1REFBZ0U7QUFFaEUsd0JBQStCLFFBQWUsRUFBRSxNQUFhO0lBRXpELElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUVwQiwwQkFBMEIsSUFBVztRQUNqQyxJQUFJLEtBQUssR0FBRyw4QkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO1FBQzlDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVwRCxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBELEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUNoRCxDQUFDO1lBQ0csVUFBVSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4RyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixVQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDaEUsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVsQyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3RCLENBQUM7QUE5QkQsd0NBOEJDO0FBRUQsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBS3hELElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVwQixFQUFFLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXJCLDJCQUEyQixVQUF5QjtJQUNoRCxNQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN6RSxDQUFDIn0=