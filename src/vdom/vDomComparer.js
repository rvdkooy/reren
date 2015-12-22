var VElement = require('./vElement');
var variables = require('../variables');
var { Component } = require('../component');

var { InsertElement, SetInnerHtml, RemoveElement, SetAttribute } = require('./domOperations');

module.exports.getChanges = (newDomRoot, prevDomRoot, rootIdentifier) => {
    
    if (newDomRoot && !newDomRoot.identifier) {
        prepareForComparison(newDomRoot, rootIdentifier);
    }

    if(prevDomRoot && !prevDomRoot.identifier) {
        prepareForComparison(prevDomRoot,rootIdentifier);
    }

    var operations = [];

    function internalParse(currentElement, prevElement, identifier) {
        let parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"))

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

            } else {
                
                if (prevElement.content && (currentElement.content !== prevElement.content)) {
                    
                    // if the inner content has changed we update it: eg: string
                    operations.push(new SetInnerHtml(identifier, currentElement.content));
                }

                if(currentElement.attributes) {
                    for (var attr in currentElement.attributes) {
                        
                        if (!prevElement.attributes || prevElement.attributes[attr] !== currentElement.attributes[attr]) {
                            var attrName = attr;
                            if (attr === "classes") attrName = "class";
                            operations.push(new SetAttribute(currentElement.identifier, attrName, 
                                                    currentElement.attributes[attr]));
                        }
                    };
                }
            }
        }

        // Dealing with innerHTML --> children
        if(currentElement && currentElement.children) {
            
            handleChildren(currentElement, prevElement, identifier);
        }
    };

    function handleChildren(currentElem, prevElem, identifier) {
        // removing children that are not there anymore: eg: table tr
        if((prevElem && prevElem.children) && currentElem.children.length === 0) {
            for (var i = 0; i < prevElem.children.length; i++) {
                operations.push(new RemoveElement(identifier, identifier + "_" + (i+1)));
            };
        }

        // loop through all children of the current element
        for (var i = 0; i < currentElem.children.length; i++) {

            var currentChild = currentElem.children[i];
            var prevChild = (prevElem) ? prevElem.children[i] : null;
            // var parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"));
            internalParse(currentChild, prevChild, identifier + "_" + (i+1));
        };
    }

    internalParse(newDomRoot, prevDomRoot, rootIdentifier);
    
    return operations;
};


var prepareForComparison = (vElement, rootIdentifier) => {

    if (typeof vElement !== "object") {
        throw new Error("the vElement has to be an instance of a VELEMENT!");
    }

    rootIdentifier = rootIdentifier || "1_1";

    function iterate(element, identifier) {
        element.identifier = identifier;
        if (element.componentInstance) {
            element.componentInstance.identifier = identifier;
        }

        if (element.children && element.children.length) {
            for (var i = 0; i < element.children.length; i++) {
                

                iterate(element.children[i], `${identifier}_${i+1}`);
            };
        }
    }

    iterate(vElement, rootIdentifier);
};

module.exports.prepareForComparison = prepareForComparison;