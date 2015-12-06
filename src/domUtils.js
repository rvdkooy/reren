var vElement = require('./vElement');
var variables = require('./variables');
var { InsertElement, SetInnerHtml, RemoveElement } = require('./domOperations');

module.exports.getChanges = (newDomRoot, prevDomRoot, rootNode) => {
    rootNode.setAttribute(variables.ID_ATTR, variables.ROOT_IDENTIFIER);
    var operations = [];

    function internalParse(currentElement, prevElement, parentIdentifier, counter) {
        counter = counter || 1;
        var identifier = parentIdentifier + "_" + counter;

        if (currentElement && !prevElement) {
            // if the element could not be found, we insert it now
            var insert = new InsertElement(parentIdentifier, identifier, currentElement.tagName, 
                currentElement.attributes, currentElement.children || currentElement.content);

            operations.push(insert);
        }
        else if(currentElement || prevElement) {
            

            if(!currentElement && prevElement) {
                // if the current element is not there anymore we should remove it
                operations.push(new RemoveElement(parentIdentifier, identifier));

            } else if (prevElement.content && (currentElement.content !== prevElement.content)) {
                
                // if the inner content has changed we update it: eg: string
                operations.push(new SetInnerHtml(identifier, currentElement.content));
            }
        }

        // Dealing with innerHTML --> children
        if(currentElement && currentElement.children) {
            
            // removing children that are not there anymore: eg: table tr
            if((prevElement && prevElement.children) && currentElement.children.length === 0) {
                for (var i = 0; i < prevElement.children.length; i++) {
                    operations.push(new RemoveElement(identifier, identifier + "_" + (i+1)));
                };
            }

            // loop through all children of the current element
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