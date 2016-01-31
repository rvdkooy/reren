var variables = require('../variables');
var documentHelpers = require('./documentHelpers');

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

    constructor(parentIdentifier, identifier, tagName, innerHtml) {
        if (!parentIdentifier) {
            throw new Error("For inserting we need a parentIdentifier");
        }

        if (!identifier) throw new Error("For inserting we need an indentifier");
        if (!tagName) throw new Error("For inserting we need an tagName");

        this.parentIdentifier = parentIdentifier;
        this.identifier = identifier;
        this.tagName = tagName;
        this.innerHtml = innerHtml;
    }

    apply() {
        var element = document.createElement(this.tagName);
        element.setAttribute(variables.ID_ATTR, this.identifier);

        if (this.innerHtml) {
            element.innerHTML = this.innerHtml;
        }

        documentHelpers.findElement(this.parentIdentifier).appendChild(element);
    }
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
    }
}

/**
 * This DOM operation will remove the element from the DOM
 * @parentIdentifier             {The identifier of the parent element of the element we want to remove}
 * @identifier           {The identifier of the element we want to remove from the DOM}
 */
class RemoveElement {
    constructor(parentIdentifier, identifier) {
        this.parentIdentifier = parentIdentifier;
        this.identifier = identifier;
    }

    apply() {
        documentHelpers.findElement(this.parentIdentifier).removeChild(documentHelpers.findElement(this.identifier));
    }
}

class SetAttribute {
    constructor(identifier, attributeName, attributeValue) {
        this.identifier = identifier;
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
    }

    apply() {
        documentHelpers.findElement(this.identifier).setAttribute(this.attributeName, this.attributeValue);
    }
}

class RemoveAttribute {
    constructor(identifier, attributeName) {
        this.identifier = identifier;
        this.attributeName = attributeName;
    }

    apply() {
        documentHelpers.findElement(this.identifier).removeAttribute(this.attributeName);
    }
}

class AddEventListener {
    constructor(identifier, eventName, handler) {
        this.identifier = identifier;
        this.eventName = eventName;
        this.handler = handler;
    }

    apply() {
        var shortEventName = this.eventName.toLowerCase().substring(2);
        documentHelpers.findElement(this.identifier).addEventListener(shortEventName, this.handler);
    }
}

class RemoveEventListener {
    constructor(identifier, eventName, handler) {
        this.identifier = identifier;
        this.eventName = eventName;
        this.handler = handler;
    }

    apply() {
        var shortEventName = this.eventName.toLowerCase().substring(2);
        documentHelpers.findElement(this.identifier).removeEventListener(shortEventName, this.handler);
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
    RemoveAttribute,
    SetInnerHtml,
    AddEventListener,
    RemoveEventListener
};