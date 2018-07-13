/*
  Originally from http://blog.olkie.com/2013/11/05/online-c-function-prototype-header-generator-tool/
*/

const cKeywords = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"];
const invalidFunctionNames = cKeywords;
const invalidReturnTypes = ["auto", "break", "case", "continue", "default", "do", "else", "for", "goto", "if", "return", "sizeof", "switch", "while", "typedef"]; //TODO: may have some of these wrong


//grab all comment blocks, and comment lines preceding function definition
const reStringPart = /"(?:\\[\n|.]|[^\n\\])"/.source;
const reStarComment = /\/[*](?:[*](?!\/)|[^*])*[*]\//.source;
const reLineComment = /\/\/.*(?=\n|$)/.source; //NOTE the look ahead! can't capture \n, because js doesn't support \Z and we need our big re pattern below to be able to match on \Z or $ if not using multiline mode
const reComment = `(?:${reStarComment}|${reLineComment})`
const reStringOrCommentOrAny = "(?:" + reComment + "|" + reStringPart + "|[^])*?"; //tries to respect comments and strings
//var reBeforePart = /([\s\S]*?)/.source; //does not respect comments or strings
const reBeforePart = "(" + reStringOrCommentOrAny + '\\s*?' + ")";



export class FoundFunction {

  before = "";
  beforeLastComment = "";
  touchingComment = "";
  functionMatch  = "";  //doesn't include before
  returnType = "";
  functionName = "";
  parameters = "";
  declared = false;
  entireMatch = "";
  after = "";
}


export function getFunctions(inputCode: string, shouldParseComments: boolean = true) {
  var functions: FoundFunction[] = [];

  //convert all line endings to a \n
  inputCode = inputCode.replace(/\r\n|\r/g, "\n");

  //can't use multiline mode because we need to match on end of input, not just line
  var re = new RegExp(reBeforePart + /((?:(?:^|\n)\s*?(\w+[\s*?\t\w]+)\b\s*?(\w+)\s*?\(\s*?([^)]*)\s*?\)\s*?([{;])))/.source, "g");  
  
  //console.log(re);
  let groups : RegExpExecArray;
  let previousBefore = "";
  let lastMatchIndex : number;
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
    } else {
      previousBefore = func.entireMatch;
    }
  }



  if (functions.length > 0) {
    let lastFunc = functions[functions.length-1];
    lastFunc.after = inputCode.substring(lastMatchIndex);
  }

  return functions;
}

function tryParseComments(shouldParseComments: boolean, foundFunction: FoundFunction) {
  if (shouldParseComments === true) {
    extractLastComment(foundFunction);
  }
}

function isFunctionValid(foundFunction: FoundFunction) {
  let foundValidFunction = false;

  if (foundFunction.functionName) {
    if (hasInvalidReturnType(foundFunction) == false && hasInvalidFunctionName(foundFunction) == false) {
      foundValidFunction = true;
    }
  }
  return foundValidFunction;
}

function hasInvalidFunctionName(foundFunction: FoundFunction): boolean {
  return invalidFunctionNames.indexOf(foundFunction.functionName.toLowerCase()) != -1;
}

function hasInvalidReturnType(foundFunction: FoundFunction) {
  let returnTypes = foundFunction.returnType.toLowerCase().split(/[\s*]+/);
  return arraysIntersect(returnTypes, invalidReturnTypes);
}

function extractLastComment(foundFunction: FoundFunction) {
  let reRepeatedLineComment = /(?:[ \t]*\/\/.*(?:\n|$))+/.source;
  let reTouchingComment = new RegExp(`^` + reBeforePart + `(${reStarComment}|${reRepeatedLineComment})[ \t]*$`);

  let groups = reTouchingComment.exec(foundFunction.before);

  if (groups !== null) {
    foundFunction.beforeLastComment = (groups[1] || "");
    foundFunction.touchingComment = groups[2];
  } else {
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
