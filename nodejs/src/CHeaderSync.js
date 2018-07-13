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
            let toFuncs = CFunctionParser_1.getFunctions(inputCode);
            for (const func of toFuncs) {
                let sourceInfo = (this.syncMap.get(func.functionName) || [])[0];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ0hlYWRlclN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDSGVhZGVyU3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlCQUEwQjtBQUMxQixpQ0FBaUM7QUFDakMsdURBQWdFO0FBRWhFLElBQVksWUFJWDtBQUpELFdBQVksWUFBWTtJQUNwQiwrQ0FBSSxDQUFBO0lBQ0osbURBQU0sQ0FBQTtJQUNOLGlFQUFhLENBQUE7QUFDakIsQ0FBQyxFQUpXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSXZCO0FBRUQ7SUFBQTtRQUdJLGlCQUFZLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztJQUNyQyxDQUFDO0NBQUE7QUFKRCw0QkFJQztBQUVEO0lBQUE7UUFFSSxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7SUFvRDVDLENBQUM7SUFsRFUsU0FBUyxDQUFDLFlBQTRCO1FBRXpDLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFNUMsR0FBRyxDQUFDLENBQUMsTUFBTSxRQUFRLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hELElBQUksS0FBSyxHQUFHLDhCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDOUIsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0JBQzdCLFFBQVEsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUU5QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVNLFdBQVcsQ0FBQyxjQUE4QjtRQUU3QyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWhELEdBQUcsQ0FBQyxDQUFDLE1BQU0sUUFBUSxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDckQsSUFBSSxPQUFPLEdBQUcsOEJBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUV0QyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFaEUsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FDOUUsQ0FBQztvQkFDRyxVQUFVLElBQUksSUFBSSxDQUFDLGlCQUFpQjswQkFDdkIsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7Z0JBQzFELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osVUFBVSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzlCLENBQUM7Z0JBRUQsVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNsRCxDQUFDO1lBRUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFbEMsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUVKO0FBdERELGtDQXNEQztBQUVELDJCQUEyQixlQUF1QjtJQUM5QyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFHRCxJQUFJLEtBQUssR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBRTlCLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyJ9