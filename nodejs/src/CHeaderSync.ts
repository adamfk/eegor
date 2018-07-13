
import fs = require("fs");
import globby = require("globby")
import { getFunctions, FoundFunction } from "./CFunctionParser";

export enum SyncStrategy {
    AUTO, 
    UPDATE, 
    USE_AS_SOURCE
}

export class SyncInfo {
    filePath: string;
    foundFunction: FoundFunction;
    syncStrategy = SyncStrategy.AUTO;
}

export class CHeaderSync {

    syncMap = new Map<string, SyncInfo[]>();

    public scanFiles(scanPatterns:string|string[])
    {
        let filesToScan = globby.sync(scanPatterns);

        for (const filePath of filesToScan) {
            console.log(`Scanning file ${filePath}`);
            
            let code = fs.readFileSync(filePath).toString();
            let funcs = getFunctions(code);
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

    public updateFiles(updatePatterns:string|string[])
    {
        let filesToUpdate = globby.sync(updatePatterns);

        for (const filePath of filesToUpdate) {
            let outputCode = "";
            let inputCode = fs.readFileSync(filePath).toString();
            console.log(`Finding functions in ${filePath}`);
            let toFuncs = getFunctions(inputCode);

            for (const func of toFuncs) {
                let sourceList = this.syncMap.get(func.functionName);
                let sourceInfo : SyncInfo;

                if (sourceList)
                {
                    if (sourceList.length > 1) {
                        console.log(`Multiple sources found for ${func.functionName}`, sourceList);
                    }

                    sourceInfo = sourceList[0];
                }

                if (sourceInfo && hasDoxygenComment(sourceInfo.foundFunction.touchingComment))
                {
                    outputCode += func.beforeLastComment 
                               + sourceInfo.foundFunction.touchingComment;
                } else {
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

function hasDoxygenComment(touchingComment: string) {
    return touchingComment.match(/^\/[*][*][^*]|^\/{3}[^\/]/);
}


let syncr = new CHeaderSync();

syncr.scanFiles("test/*.c");
syncr.updateFiles("test/*.h");

console.log("done!");
