var vElement = require('./vElement');
var { InsertElement, SetInnerHtml } = require('./domOperations');
var ID_ATTR = "data-internal-id";

module.exports.getChanges = (newDomRoot, prevDomRoot, rootNode) => {
    rootNode.setAttribute(ID_ATTR, "0");
    var parentIdentifier = "0";
    var level = 1;
    var counter = 0;
    var operations = [];

    function internalParse(currentElement, prevElement) {
        
        counter++;
        var identifier = level + "_" + counter;

        if (currentElement && !prevElement) {
            
            var insert = new InsertElement(parentIdentifier, identifier, currentElement.tagName, 
                currentElement.attributes, currentElement.children || currentElement.content);

            operations.push(insert);
        } else {
            operations = operations.concat(getChangesBetween(identifier, currentElement, prevElement));
        }

        parentIdentifier = identifier;

        if(currentElement.children) {
            for (var i = 0; i < currentElement.children.length; i++) {
                
                level = counter;
                counter = 1;

                var currentChild = currentElement.children[i];
                var prevChild = (prevElement) ? prevElement.children[i] : null;

                internalParse(currentChild, prevChild);
            };
        }
        
        // }
    };

    internalParse(newDomRoot, prevDomRoot);
    
    return operations;
};

var getChangesBetween = (indentifier, currentNode, previousNode) => {

    var changes = [];

    if (previousNode.content && (currentNode.content !== previousNode.content)) {
        changes.push(new SetInnerHtml(indentifier, currentNode.content));
    }
    return changes;
}