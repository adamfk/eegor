"use strict";
/*
  Originally from http://blog.olkie.com/2013/11/05/online-c-function-prototype-header-generator-tool/
*/
Object.defineProperty(exports, "__esModule", { value: true });
const cKeywords = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"];
const invalidFunctionNames = cKeywords;
const invalidReturnTypes = ["auto", "break", "case", "continue", "default", "do", "else", "for", "goto", "if", "return", "sizeof", "switch", "while", "typedef"]; //TODO: may have some of these wrong
//grab all comment blocks, and comment lines preceding function definition
const reStringPart = /"(?:\\[\n|.]|[^\n\\])"/.source;
const reStarComment = /\/[*](?:[*](?!\/)|[^*])*[*]\//.source;
const reLineComment = /\/\/.*(?=\n|$)/.source; //NOTE the look ahead! can't capture \n, because js doesn't support \Z and we need our big re pattern below to be able to match on \Z or $ if not using multiline mode
const reComment = `(?:${reStarComment}|${reLineComment})`;
const reStringOrCommentOrAny = "(?:" + reComment + "|" + reStringPart + "|[^])*?"; //tries to respect comments and strings
//var reBeforePart = /([\s\S]*?)/.source; //does not respect comments or strings
const reBeforePart = "(" + reStringOrCommentOrAny + '\\s*?' + ")";
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
    var re = new RegExp(reBeforePart + /((?:(?:^|\n)\s*?(\w+[\s*?\t\w]+)\b\s*?(\w+)\s*?\(\s*?([^)]*)\s*?\)\s*?([{;])))/.source, "g");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ0Z1bmN0aW9uUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ0Z1bmN0aW9uUGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7RUFFRTs7QUFFRixNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6VCxNQUFNLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztBQUN2QyxNQUFNLGtCQUFrQixHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLG9DQUFvQztBQUd0TSwwRUFBMEU7QUFDMUUsTUFBTSxZQUFZLEdBQUcsd0JBQXdCLENBQUMsTUFBTSxDQUFDO0FBQ3JELE1BQU0sYUFBYSxHQUFHLCtCQUErQixDQUFDLE1BQU0sQ0FBQztBQUM3RCxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxzS0FBc0s7QUFDck4sTUFBTSxTQUFTLEdBQUcsTUFBTSxhQUFhLElBQUksYUFBYSxH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