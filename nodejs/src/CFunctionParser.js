"use strict";
/*
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>

Originally from http://blog.olkie.com/2013/11/05/online-c-function-prototype-header-generator-tool/

*/
Object.defineProperty(exports, "__esModule", { value: true });
const cKeywords = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"];
const invalidFunctionNames = cKeywords;
const invalidReturnTypes = ["auto", "break", "case", "continue", "default", "do", "else", "for", "goto", "if", "return", "sizeof", "switch", "while", "typedef"]; //TODO: may have some of these wrong
//grab all comment blocks, and comment lines preceding function definition
const reStringPart = /"(?:\\[\n|.]|[^\n\\])"/.source;
const reCommentPart = /\/(?:[*][\s\S]*?(?:[*]\/|$)|\/.*(?=\n|$))/.source; //NOTE the look ahead! can't capture \n, because js doesn't support \Z and we need our big re pattern below to be able to match on \Z or $ if not using multiline mode
const reStringOrCommentOrAny = "(?:" + reCommentPart + "|" + reStringPart + "|[\\s\\S])*?"; //tries to respect comments and strings
//var reBeforePart = /([\s\S]*?)/.source; //does not respect comments or strings
const reBeforePart = "(" + reStringOrCommentOrAny + '\\s*' + ")";
class FoundFunction {
    constructor() {
        this.before = "";
        this.beforeLastComment = "";
        this.touchingComment = "";
        this.functionMatch = ""; //doesn't include before
        this.returnType = "";
        this.functionName = "";
        this.parameters = "";
        this.declared = false;
        this.entireMatch = "";
        this.after = "";
    }
}
exports.FoundFunction = FoundFunction;
function getFunctions(inputCode, shouldParseComments = true) {
    var functions = [];
    //convert all line endings to a \n
    inputCode = inputCode.replace(/\r\n|\r/g, "\n");
    //can't use multiline mode because we need to match on end of input, not just line
    var re = new RegExp(reBeforePart + /((?:(?:^|\n)\s*(\w+[\s*\t\w]+)\b\s*(\w+)\s*\(\s*([^)]*)\s*\)\s*([{;])))/.source, "g");
    //console.log(re);
    let groups;
    let previousBefore = "";
    let lastMatchIndex;
    while ((groups = re.exec(inputCode)) !== null) {
        lastMatchIndex = groups.index + groups[0].length;
        var func = new FoundFunction();
        func.entireMatch = groups[0];
        func.before = previousBefore + (groups[1] || "");
        func.functionMatch = groups[2];
        func.returnType = (groups[3] || "");
        func.functionName = (groups[4] || "");
        func.parameters = (groups[5] || "");
        if (groups[6] == ";") {
            func.declared = true;
        }
        if (isFunctionValid(func)) {
            tryParseComments(shouldParseComments, func);
            functions.push(func);
            previousBefore = "";
        }
        else {
            previousBefore = func.entireMatch;
        }
    }
    if (functions.length > 0) {
        let lastFunc = functions[functions.length - 1];
        lastFunc.after = inputCode.substring(lastMatchIndex);
    }
    return functions;
}
exports.getFunctions = getFunctions;
function tryParseComments(shouldParseComments, foundFunction) {
    if (shouldParseComments === true) {
        extractLastComment(foundFunction);
    }
}
function isFunctionValid(foundFunction) {
    let foundValidFunction = false;
    if (foundFunction.functionName) {
        if (hasInvalidReturnType(foundFunction) == false && hasInvalidFunctionName(foundFunction) == false) {
            foundValidFunction = true;
        }
    }
    return foundValidFunction;
}
function hasInvalidFunctionName(foundFunction) {
    return invalidFunctionNames.indexOf(foundFunction.functionName.toLowerCase()) != -1;
}
function hasInvalidReturnType(foundFunction) {
    let returnTypes = foundFunction.returnType.toLowerCase().split(/[\s*]+/);
    return arraysIntersect(returnTypes, invalidReturnTypes);
}
function extractLastComment(foundFunction) {
    let reStarComment = /\/[*](?:[*](?!\/)|[^*])*[*]\//.source;
    let reRepeatedLineComment = /(?:[ \t]*\/\/.*(?:\n|$))+/.source;
    let reTouchingComment = new RegExp(`^` + reBeforePart + `(${reStarComment}|${reRepeatedLineComment})[ \t]*$`);
    let groups = reTouchingComment.exec(foundFunction.before);
    if (groups !== null) {
        foundFunction.beforeLastComment = (groups[1] || "");
        foundFunction.touchingComment = groups[2];
    }
    else {
        foundFunction.beforeLastComment = foundFunction.before;
    }
}
function arraysIntersect(array1, array2) {
    var result = false;
    for (var i = 0; !result && i < array2.length; i++) {
        result = array1.indexOf(array2[i]) !== -1;
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ0Z1bmN0aW9uUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ0Z1bmN0aW9uUGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTRCRTs7QUFFRixNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6VCxNQUFNLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztBQUN2QyxNQUFNLGtCQUFrQixHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLG9DQUFvQztBQUd0TSwwRUFBMEU7QUFDMUUsTUFBTSxZQUFZLEdBQUcsd0JBQXdCLENBQUMsTUFBTSxDQUFDO0FBQ3JELE1BQU0sYUFBYSxHQUFHLDJDQUEyQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLHNLQUFzSztBQUNoUCxNQUFNLHNCQUFzQixHQUFHLEtBQUssR0FBRyxhQUFhLEdBQUcsR0FBRyxHQUFHLFlBQVks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