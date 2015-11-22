var vElement = require('./vElement');
var variables = require('./variables');
var { InsertElement, SetInnerHtml } = require('./domOperations');

module.exports.getChanges = (newDomRoot, prevDomRoot, rootNode) => {
    rootNode.setAttribute(variables.ID_ATTR, variables.ROOT_IDENTIFIER);
    var operations = [];

    function internalParse(currentElement, prevElement, parentIdentifier, counter) {
        counter = counter || 1;
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

    internalParse(newDomRoot, prevDomRoot, variables.ROOT_IDENTIFIER);
    
    return operations;
};