var vElement = require('./vElement');
var variables = require('../variables');
var { Component } = require('../component');

var { InsertElement, SetInnerHtml, RemoveElement } = require('./domOperations');

module.exports.getChanges = (newDomRoot, prevDomRoot, identifier) => {
    
    var operations = [];

    function internalParse(currentElement, prevElement, identifier, counter) {
        counter = counter || 1;
        let _currentElement = currentElement;
        let _prevElement = _prevElement;
        let parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"))
        //var identifier = ;

        if(currentElement && currentElement.componentInstance) {
            currentElement.componentInstance.identifier = identifier;
            _currentElement = currentElement.componentInstance.getView();
        }
        if(_prevElement && _prevElement.componentInstance) {
            _prevElement = prevElement.componentInstance.getView();
        }

        if(_currentElement) {
            _currentElement.identifier = identifier
        }

        if (_currentElement && !_prevElement) {
            // if the element could not be found, we insert it now
            var insert = new InsertElement(parentIdentifier, identifier, _currentElement.tagName, 
                _currentElement.attributes, _currentElement.children || _currentElement.content);

            operations.push(insert);
        }
        else if(_currentElement || _prevElement) {
            

            if(!_currentElement && _prevElement) {
                // if the current element is not there anymore we should remove it
                operations.push(new RemoveElement(parentIdentifier, identifier));

            } else if (_prevElement.content && (_currentElement.content !== _prevElement.content)) {
                
                // if the inner content has changed we update it: eg: string
                operations.push(new SetInnerHtml(identifier, _currentElement.content));
            }
        }

        // Dealing with innerHTML --> children
        if(_currentElement && _currentElement.children) {
            
            handleChildren(_currentElement, _prevElement, identifier, counter);
        }
    };

    function handleChildren(currentElem, prevElem, identifier, counter) {
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
            var parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"));
            internalParse(currentChild, prevChild, parentIdentifier + "_" + counter, (i+1));
        };
    }

    internalParse(newDomRoot, prevDomRoot, identifier);
    
    return operations;
};