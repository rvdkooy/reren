var variables = require('../variables');
var documentHelpers = require('./documentHelpers')

var applyDomChanges = (operation) => {
    operation.apply();
};

/**
 * This DOM operation will insert a new DOM element below the provided parent
 * @parentIdentifier             {The id of the parent element where to put the element on}
 * @identifier           {The identifier of the new element which can be used to find it later}
 * @tagName              {The tagName of the element (eg: div, span, h1 etc)}
 * @attributes           {The attribures of the new element (eg: style, title etc)}
 */
class InsertElement {

    constructor(parentIdentifier, identifier, tagName, attributes, innerHtml) {
        if(!parentIdentifier) {
            throw new Error("For inserting we need a parentIdentifier");  
        } 
        if(!identifier) throw new Error("For inserting we need an indentifier");
        if(!tagName) throw new Error("For inserting we need an tagName");
        
        this.parentIdentifier = parentIdentifier;
        this.identifier = identifier;
        this.tagName = tagName;
        this.attributes = attributes || {};
        this.innerHtml = innerHtml;
    }
    
    apply() {
        var element = document.createElement(this.tagName);
        element.setAttribute(variables.ID_ATTR, this.identifier);
        
        for(var prop in this.attributes) {
            
            if(prop === "classes") {
                element.setAttribute("class", this.attributes[prop]);
            }
            else if(prop === "onClick") {
                element.addEventListener("click", this.attributes[prop]);
            }
            else {
                element.setAttribute(prop, this.attributes[prop]);
            }

        }

        if(this.innerHtml) {
            element.innerHTML = this.innerHtml;
        }

        documentHelpers.findElement(this.parentIdentifier).appendChild(element);
    };
}

/**
 * This DOM operation will update the innerHTML of the current element
 * @identifier           {The identifier of the element where we want to set the inner Html}
 * @innerHTML            {The actual inner Html of the element we want to set}
 */
class SetInnerHtml {

    constructor(identifier, innerHtml) {
        this.identifier = identifier;
        this.innerHtml = innerHtml;
    }
    
    apply() {
        documentHelpers.findElement(this.identifier).innerHTML = this.innerHtml;
    };
}

/**
 * This DOM operation will remove the element from the DOM
 * @parentIdentifier             {The identifier of the parent element of the element we want to remove}
 * @identifier           {The identifier of the element we want to remove from the DOM}
 */
class RemoveElement {
    constructor(parentIdentifier, identifier) {
        // console.log(`removing element with id: ${identifier} from parent with id: ${parentIdentifier}`);

        this.parentIdentifier = parentIdentifier;
        this.identifier = identifier;
    }

    apply() {
        var elementToRemove = documentHelpers.findElement(this.identifier);
        documentHelpers.findElement(this.parentIdentifier).removeChild(elementToRemove);
    }
}

class SetAttribute {
    constructor(identifier, attributeName, attributeValue) {
        this.identifier = identifier;
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
    }

    apply() {
        var elementToChange = documentHelpers.findElement(this.identifier);
        elementToChange.setAttribute(this.attributeName, this.attributeValue);
    }
}

/**
 * Exports
 */
module.exports = {
    applyDomChanges,
    InsertElement,
    RemoveElement,
    SetAttribute,
    SetInnerHtml
};