var vElement = require('./vElement');
var { InsertElement, SetInnerHtml } = require('./domOperations');
var ID_ATTR = "data-internal-id";
var ROOT_IDENTIFIER = "1";

module.exports.getChanges = (newDomRoot, prevDomRoot, rootNode) => {
    rootNode.setAttribute(ID_ATTR, ROOT_IDENTIFIER);
    var operations = [];

    function internalParse(currentElement, prevElement, parentIdentifier, counter) {
        var identifier = parentIdentifier + "_" + counter;

        if (currentElement && !prevElement) {
            
            var insert = new InsertElement(parentIdentifier, identifier, currentElement.tagName, 
                currentElement.attributes, currentElement.children || currentElement.content);

            operations.push(insert);
        } else {
            
            if (prevElement.content && (currentElement.content !== prevElement.content)) {
                operations.push(new SetInnerHtml(identifier, currentElement.content));
            }
        }

        if(currentElement.children) {
            
            for (var i = 0; i < currentElement.children.length; i++) {

                var currentChild = currentElement.children[i];
                var prevChild = (prevElement) ? prevElement.children[i] : null;

                internalParse(currentChild, prevChild, identifier, (i+1));
            };
        }
    };

    internalParse(newDomRoot, prevDomRoot, ROOT_IDENTIFIER, 1);
    
    return operations;
};