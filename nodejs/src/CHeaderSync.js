"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const globby = require("globby");
const CFunctionParser_1 = require("./CFunctionParser");
var SyncStrategy;
(function (SyncStrategy) {
    SyncStrategy[SyncStrategy["AUTO"] = 0] = "AUTO";
    SyncStrategy[SyncStrategy["UPDATE"] = 1] = "UPDATE";
    SyncStrategy[SyncStrategy["USE_AS_SOURCE"] = 2] = "USE_AS_SOURCE";
})(SyncStrategy = exports.SyncStrategy || (exports.SyncStrategy = {}));
class SyncInfo {
    constructor() {
        this.syncStrategy = SyncStrategy.AUTO;
    }
}
exports.SyncInfo = SyncInfo;
class CHeaderSync {
    constructor() {
        this.syncMap = new Map();
    }
    scanFiles(scanPatterns) {
        let filesToScan = globby.sync(scanPatterns);
        for (const filePath of filesToScan) {
            console.log(`Scanning file ${filePath}`);
            let code = fs.readFileSync(filePath).toString();
            let funcs = CFunctionParser_1.getFunctions(code);
            for (const func of funcs) {
                let syncInfo = new SyncInfo();
                syncInfo.filePath = filePath;
                syncInfo.foundFunction = func;
                let list = this.syncMap.get(func.functionName) || [];
                list.push(syncInfo);
                this.syncMap.set(func.functionName, list);
            }
        }
    }
    updateFiles(updatePatterns) {
        let filesToUpdate = globby.sync(updatePatterns);
        for (const filePath of filesToUpdate) {
            let outputCode = "";
            let inputCode = fs.readFileSync(filePath).toString();
            console.log(`Finding functions in ${filePath}`);
            let toFuncs = CFunctionParser_1.getFunctions(inputCode);
            for (const func of toFuncs) {
                let sourceList = this.syncMap.get(func.functionName);
                let sourceInfo;
                if (sourceList) {
                    if (sourceList.length > 1) {
                        console.log(`Multiple sources found for ${func.functionName}`, sourceList);
                    }
                    sourceInfo = sourceList[0];
                }
                if (sourceInfo && hasDoxygenComment(sourceInfo.foundFunction.touchingComment)) {
                    outputCode += func.beforeLastComment
                        + sourceInfo.foundFunction.touchingComment;
                }
                else {
                    outputCode += func.before;
                }
                outputCode += func.functionMatch + func.after;
            }
            outputCode.replace(/\n/g, "\r\n");
            if (outputCode != inputCode) {
                fs.writeFileSync(filePath, outputCode);
            }
        }
    }
}
exports.CHeaderSync = CHeaderSync;
function hasDoxygenComment(touchingComment) {
    return touchingComment.match(/^\/[*][*][^*]|^\/{3}[^\/]/);
}
let syncr = new CHeaderSync();
syncr.scanFiles("test/*.c");
syncr.updateFiles("test/*.h");
console.log("done!");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ0hlYWRlclN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDSGVhZGVyU3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlCQUEwQjtBQUMxQixpQ0FBaUM7QUFDakMsdURBQWdFO0FBRWhFLElBQVksWUFJWDtBQUpELFdBQVksWUFBWTtJQUNwQiwrQ0FBSSxDQUFBO0lBQ0osbURBQU0sQ0FBQTtJQUNOLGlFQUFhLENBQUE7QUFDakIsQ0FBQyxFQUpXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSXZCO0FBRUQ7SUFBQTtRQUdJLGlCQUFZLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztJQUNyQyxDQUFDO0NBQUE7QUFKRCw0QkFJQztBQUVEO0lBQUE7UUFFSSxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7SUFpRTVDLENBQUM7SUEvRFUsU0FBUyxDQUFDLFlBQTRCO1FBRXpDLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFNUMsR0FBRyxDQUFDLENBQUMsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRXpDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEQsSUFBSSxLQUFLLEdBQUcsOEJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUM5QixRQUFRLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztnQkFDN0IsUUFBUSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7Z0JBRTlCLElBQUksSUFBSSxH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